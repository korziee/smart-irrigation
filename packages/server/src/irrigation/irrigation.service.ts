import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { sub, add } from 'date-fns';
import { SolenoidService } from 'src/solenoid/solenoid.service';
import { PaginationParameters } from 'src/types/pagination-params';
import { Zone } from '../zone/entities/zone.entity';

import { ZoneService } from '../zone/zone.service';
import { IrrigationJob } from './entities/irrigation-job.entity';
import { IrrigationRepository } from './irrigation.repository';
import { MoistureLevel } from './types/moisture-level';

@Injectable()
export class IrrigationService {
  constructor(
    private readonly repository: IrrigationRepository,
    private readonly solenoidService: SolenoidService,
    @Inject(forwardRef(() => ZoneService))
    private readonly zoneService: ZoneService,
  ) {}

  private readonly logger = new Logger(IrrigationService.name);
  private jobTimerId: ReturnType<typeof setTimeout>;
  private readonly jobIntervalMs = 60000;

  // these values are total guesses and its possibly better to have this information in the sensor service.
  private mapSensorReadingToMoistureLevel(reading: number): MoistureLevel {
    if (reading < 100) {
      return 'dry';
    }

    if (reading < 250) {
      return 'dryish';
    }

    if (reading < 500) {
      return 'moist';
    }

    if (reading < 1000) {
      return 'wet';
    }

    // should never happen, helps to have it here for debugging
    throw new Error('moisture is off the charts!');
  }

  public async startSmartIrrigation() {
    this.logger.verbose(`Starting smart irrigation loop`);

    try {
      await this.handleExpiredJobs();
      await this.irrigateZonesIfRequired();
    } catch (e) {
      this.logger.error('There was an error with the smart irrigation loop', e);
    }

    this.jobTimerId = setTimeout(
      () => this.startSmartIrrigation(),
      this.jobIntervalMs,
    );
  }

  public stopSmartIrrigation() {
    clearTimeout(this.jobTimerId);
  }

  public async handleSolenoidOverride(zoneId: string) {
    const activeJobsInZone = await this.repository.findManyJobs({
      where: {
        zone_id: zoneId,
        active: true,
      },
    });

    // no active jobs, no need to do anything here
    if (activeJobsInZone.length === 0) {
      this.logger.verbose(
        'No active jobs in zone, no action after solenoid override',
      );
      return;
    }

    const solenoidsInZone = await this.solenoidService.findMany({ zoneId });

    // at least one solenoid in zone is still being manually controlled
    // we do not need to stop any ongoing irrigation jobs
    if (solenoidsInZone.find((s) => s.controlMode === 'auto')) {
      this.logger.verbose(
        'At least one solenoid is in the auto control mode, no action after solenoid override',
      );
      return;
    }

    const jobsToExpire = activeJobsInZone.map(({ id }) => id);

    this.logger.log('Cancelling jobs after solenoid override', jobsToExpire);

    // otherwise, all solenoids are being manually controlled, we need to
    // cancel the active jobs
    await this.repository.markJobsAsInactive(jobsToExpire);
  }

  public async handleExpiredJobs() {
    const expiredActiveJobs = await this.repository.findManyJobs({
      where: {
        active: true,
        end: {
          lte: new Date(),
        },
      },
    });

    // ask zone service to turn off all solenoids in zone
    await Promise.all(
      expiredActiveJobs.map(async (ej) =>
        this.zoneService.updateAllSolenoidsInZone(
          ej.zoneId,
          'irrigation-service',
          'auto',
          false,
        ),
      ),
    );

    const expiredJobIds = expiredActiveJobs.map(({ id }) => id);

    if (expiredJobIds.length === 0) {
      this.logger.log(`There are no expired jobs`);
      return;
    }

    // update job status to be inactive
    await this.repository.markJobsAsInactive(expiredJobIds);
    this.logger.log(`Marked the following jobs as inactive:`, expiredJobIds);
  }

  private async getInactiveZones(): Promise<Zone[]> {
    const activeZoneIds = (await this.repository.getActiveJobs()).map(
      (j) => j.zoneId,
    );
    const allZones = await this.zoneService.getAllZones();
    const zonesWithNoActiveJobs = allZones.filter(
      (zone) => !activeZoneIds.includes(zone.id),
    );

    return zonesWithNoActiveJobs;
  }

  public async irrigateZonesIfRequired() {
    // fetch inactive zones
    const inactiveZones = await this.getInactiveZones();
    const fiveMinutesAgo = sub(new Date(), { minutes: 5 });

    for (const zone of inactiveZones) {
      try {
        const readings = await this.zoneService.getRecentSensorReadingsForZone(
          zone.id,
          {
            // we fetch based on time rather than quantity as we know there will always be x events
            // send every minute. The more the merrier as we'll take an average.
            from: fiveMinutesAgo,
          },
        );

        if (readings.length === 0) {
          this.logger.warn(
            `No readings in the last 5 minutes for zone: ${zone.id}`,
          );
          continue;
        }

        const total = readings.reduce(
          (prev, current) => prev + current.reading,
          0,
        );

        const average = Math.round(total / readings.length);

        const zoneMoistureLevel = this.mapSensorReadingToMoistureLevel(average);

        if (['dry', 'dryish'].includes(zoneMoistureLevel)) {
          this.logger.log(`Starting irrigation in zone with id: ${zone.id}`);

          await this.zoneService.updateAllSolenoidsInZone(
            zone.id,
            'irrigation-service',
            'auto',
            true,
          );
          await this.repository.createManyJobs([
            {
              zoneId: zone.id,
              active: true,
              start: new Date(),
              end: add(new Date(), {
                minutes: 15,
              }),
            },
          ]);
        }
      } catch (e) {
        this.logger.error(
          `An error occurred while checking if zone ${zone.id} needs irrigating`,
          e,
        );
      }
    }
  }

  public async getIrrigationJobsForZone(
    filter: {
      zoneId: string;
      active: boolean | null;
    },
    pagination?: PaginationParameters,
  ): Promise<IrrigationJob[]> {
    return this.repository.findManyJobs({
      where: {
        zone_id: filter.zoneId,
        active: filter.active === null ? undefined : filter.active,
      },
      orderBy: {
        start: 'desc',
      },
      skip: pagination?.skip,
      take: pagination?.take,
    });
  }
}

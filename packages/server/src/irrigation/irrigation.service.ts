import { Injectable, Logger } from '@nestjs/common';
import { sub, add } from 'date-fns';
import { Zone } from '../zone/entities/zone.entity';

import { ZoneService } from '../zone/zone.service';
import { IrrigationRepository } from './irrigation.repository';
import { MoistureLevel } from './types/moisture-level';

@Injectable()
export class IrrigationService {
  constructor(
    private readonly repository: IrrigationRepository,
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

    setTimeout(() => this.startSmartIrrigation(), this.jobIntervalMs);
  }

  public stopSmartIrrigation() {
    clearTimeout(this.jobTimerId);
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
        this.zoneService.updateAllSolenoidsInZone(ej.zoneId, 'off'),
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

          await this.zoneService.updateAllSolenoidsInZone(zone.id, 'on');
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
}

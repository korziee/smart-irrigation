import { Injectable } from '@nestjs/common';
import { MicroControllerService } from '../micro-controller/micro-controller.service';
import { MicroController } from '../micro-controller/entities/micro-controller.entity';
import { ZoneRepository } from './zone.repository';
import { SolenoidService } from '../solenoid/solenoid.service';
import { Solenoid } from '../solenoid/entities/solenoid.entity';
import { Zone } from './entities/zone.entity';
import { SensorReading } from '../sensor/entities/sensor-reading.entity';
import { SensorRepository } from '../sensor/sensor.repository';
import { SolenoidRepository } from '../solenoid/solenoid.repository';

@Injectable()
export class ZoneService {
  constructor(
    private readonly repository: ZoneRepository,
    private readonly microControllerService: MicroControllerService,
    private readonly solenoidService: SolenoidService,
    private readonly sensorRepository: SensorRepository,
    private readonly solenoidRepository: SolenoidRepository,
  ) {}

  public async getControllerForZone(zoneId: string): Promise<MicroController> {
    const zone = await this.repository.findOne(zoneId);

    return this.microControllerService.getControllerById(zone.controllerId);
  }

  /**
   * Updates local and remote states for all solenoids in the zone
   */
  public async updateAllSolenoidsInZone(
    zoneId: string,
    state: Solenoid['state'],
  ): Promise<Solenoid[]> {
    const solenoids = await this.solenoidRepository.findMany({
      where: {
        zone_id: zoneId,
      },
    });

    const updatedSolenoids = await Promise.all(
      solenoids.map(async (solenoid) => {
        const controller = await this.getControllerForZone(solenoid.zoneId);

        // tell controller to update remote state
        await this.microControllerService.sendControllerMessage(controller.id, {
          type: 'UPDATE_SOLENOID_STATE',
          data: {
            solenoidId: solenoid.id,
            state,
          },
        });

        return this.solenoidService.updateSolenoidState(solenoid.id, state);
      }),
    );

    return updatedSolenoids;
  }

  public async getManyZones(zoneIds: string[]): Promise<Zone[]> {
    return this.repository.findMany({
      where: {
        id: {
          in: zoneIds,
        },
      },
    });
  }

  public async getAllZones(): Promise<Zone[]> {
    return this.repository.findMany();
  }

  public async getRecentSensorReadingsForZone(
    zoneId: string,
    query: {
      take?: number;
      from?: Date;
      to?: Date;
      order?: 'asc' | 'desc';
    },
  ): Promise<SensorReading[]> {
    return this.sensorRepository.findManySensorReadings({
      where: {
        sensor: {
          zone_id: zoneId,
        },
        createdAt: {
          gte: query.from,
          lte: query.to,
        },
      },
      orderBy: {
        createdAt: query.order,
      },
      take: query.take,
    });
  }
}

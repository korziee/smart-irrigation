import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MicroControllerService } from '../micro-controller/micro-controller.service';
import { MicroController } from '../micro-controller/entities/micro-controller.entity';
import { ZoneRepository } from './zone.repository';
import { Solenoid } from '../solenoid/entities/solenoid.entity';
import { Zone } from './entities/zone.entity';
import { SensorReading } from '../sensor/entities/sensor-reading.entity';
import { SensorRepository } from '../sensor/sensor.repository';
import { Sensor } from '../sensor/entities/sensor.entity';
import { SolenoidService } from 'src/solenoid/solenoid.service';
import { IrrigationService } from 'src/irrigation/irrigation.service';
import {
  ZoneIrrigationList,
  ZoneIrrigationListItem,
} from './entities/zone-irrigation-list.entity';

type SolenoidUpdate = {
  solenoidId: string;
  mode: Solenoid['controlMode'];
  open: boolean;
  source: 'client' | 'micro-controller' | 'irrigation-service';
} & (
  | {
      source: 'client' | 'irrigation-service';
      zoneId: string;
      controllerId?: never;
    }
  | { source: 'micro-controller'; zoneId?: never }
);

@Injectable()
export class ZoneService {
  constructor(
    private readonly repository: ZoneRepository,
    private readonly microControllerService: MicroControllerService,
    private readonly sensorRepository: SensorRepository,
    private readonly solenoidService: SolenoidService,
    @Inject(forwardRef(() => IrrigationService))
    private readonly irrigationService: IrrigationService,
  ) {}

  public async getControllerForZone(zoneId: string): Promise<MicroController> {
    const zone = await this.repository.findOne(zoneId);

    return this.microControllerService.getControllerById(zone.controllerId);
  }

  public async updateSolenoid({
    mode,
    open,
    solenoidId,
    source,
    zoneId,
  }: SolenoidUpdate): Promise<Solenoid> {
    const solenoid = await this.solenoidService.findById(solenoidId);

    // disallow updates if the solenoid is in a physical control state
    if (solenoid.controlMode === 'physical' && source !== 'micro-controller') {
      throw new Error(
        `Cannot switch to "${mode}" mode - solenoid ${solenoidId} is currently in the physical control mode, micro-controller has explicit control`,
      );
    }

    if (source === 'client') {
      // we need to update the MCU remotely
      const controller = await this.getControllerForZone(zoneId);

      // tell controller to update remote state
      await this.microControllerService.sendControllerMessage(controller.id, {
        type: 'UPDATE_SOLENOID_STATE',
        data: {
          solenoidId: solenoidId,
          open,
        },
      });
    }

    const updatedSolenoid = await this.solenoidService.update({
      id: solenoidId,
      open,
      controlMode: mode,
    });

    if (source !== 'irrigation-service') {
      // tell irrigation-service that a solenoid in a zone has gone into a manual control state
      await this.irrigationService.handleSolenoidOverride(solenoid.zoneId);
    }

    return updatedSolenoid;
  }

  public async updateAllSolenoidsInZone(
    zoneId: string,
    source: 'client' | 'irrigation-service',
    mode: Solenoid['controlMode'],
    open: boolean,
  ): Promise<Solenoid[]> {
    const solenoids = await this.solenoidService.findMany({
      zoneId,
    });

    const updatedSolenoids = await Promise.all(
      solenoids.map(async (solenoid) => {
        return this.updateSolenoid({
          solenoidId: solenoid.id,
          source,
          mode,
          open,
          zoneId,
        });
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

  public async getSensorsInZone(zoneId: string): Promise<Sensor[]> {
    return this.sensorRepository.findMany({
      zoneId,
    });
  }

  public async getSolenoidsInZone(zoneId: string): Promise<Solenoid[]> {
    return this.solenoidService.findMany({
      zoneId,
    });
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
        created_at: {
          gte: query.from,
          lte: query.to,
        },
      },
      orderBy: {
        created_at: query.order,
      },
      take: query.take,
    });
  }

  // big ol hack here
  public async getIrrigationSummary(): Promise<ZoneIrrigationList> {
    const smart: ZoneIrrigationListItem[] = [];
    const physical: ZoneIrrigationListItem[] = [];
    const client: ZoneIrrigationListItem[] = [];

    const solenoids = await this.solenoidService.findMany();

    solenoids.forEach((solenoid) => {
      if (!solenoid.open) {
        return;
      }

      const zone = {
        zoneId: solenoid.zoneId,
        name: '',
      };

      if (solenoid.controlMode === 'physical') {
        physical.push(zone);
      } else if (solenoid.controlMode === 'client') {
        client.push(zone);
      } else {
        smart.push(zone);
      }
    });

    const zonesToFetch = new Set(
      [...smart, ...physical, ...client].map(({ zoneId }) => zoneId),
    );

    const zones = await this.repository.findMany({
      where: {
        id: {
          in: [...zonesToFetch.values()],
        },
      },
    });

    return {
      smart: smart.map(({ zoneId }) => {
        return {
          zoneId,
          name: zones.find((zone) => zone.id === zoneId).name,
        };
      }),
      physical: physical.map(({ zoneId }) => {
        return {
          zoneId,
          name: zones.find((zone) => zone.id === zoneId).name,
        };
      }),
      client: client.map(({ zoneId }) => {
        return {
          zoneId,
          name: zones.find((zone) => zone.id === zoneId).name,
        };
      }),
    };
  }

  public async getZoneById(id: string): Promise<Zone> {
    return this.repository.findOne(id);
  }
}

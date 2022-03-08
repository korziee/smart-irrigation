import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { ZoneService } from './zone.service';
import { Zone } from './entities/zone.entity';
import { Sensor } from '../sensor/entities/sensor.entity';
import { Solenoid } from '../solenoid/entities/solenoid.entity';
import { MicroController } from '../micro-controller/entities/micro-controller.entity';

@Resolver(() => Zone)
export class ZoneResolver {
  constructor(private readonly zoneService: ZoneService) {}

  @ResolveField('sensors', () => [Sensor])
  async sensors(@Parent() zone: Zone) {
    return this.zoneService.getSensorsInZone(zone.id);
  }

  @ResolveField('solenoids', () => [Solenoid])
  async solenoids(@Parent() zone: Zone) {
    return this.zoneService.getSolenoidsInZone(zone.id);
  }

  @ResolveField('controller', () => MicroController)
  async controller(@Parent() zone: Zone) {
    return this.zoneService.getControllerForZone(zone.id);
  }

  @Query(() => [Zone], { name: 'zones' })
  findAll() {
    return this.zoneService.getAllZones();
  }
}

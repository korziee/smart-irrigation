import {
  Resolver,
  Query,
  ResolveField,
  Parent,
  Mutation,
  Args,
} from '@nestjs/graphql';
import { ZoneService } from './zone.service';
import { Zone } from './entities/zone.entity';
import { Sensor } from '../sensor/entities/sensor.entity';
import { Solenoid } from '../solenoid/entities/solenoid.entity';
import { MicroController } from '../micro-controller/entities/micro-controller.entity';
import { UpdateSolenoidModeInput } from './dto/update-solenoid.input';

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

  @Mutation(() => Solenoid)
  updateSolenoidMode(
    @Args('updateSolenoidModeInput')
    { id, zoneId, mode, open }: UpdateSolenoidModeInput,
  ) {
    if (mode === 'auto' && open) {
      throw new Error(
        'cannot specify open status for a solenoid being automatically controlled',
      );
    }
    return this.zoneService.updateSolenoid(
      id,
      zoneId,
      mode,
      // reset state to off if mode is set to auto
      mode === 'auto' ? false : open,
    );
  }
}

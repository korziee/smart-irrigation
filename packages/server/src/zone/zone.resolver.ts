import {
  Resolver,
  Query,
  ResolveField,
  Parent,
  Mutation,
  Args,
  ID,
} from '@nestjs/graphql';
import { ZoneService } from './zone.service';
import { Zone } from './entities/zone.entity';
import { Sensor } from '../sensor/entities/sensor.entity';
import { Solenoid } from '../solenoid/entities/solenoid.entity';
import { MicroController } from '../micro-controller/entities/micro-controller.entity';
import {
  UpdateSolenoidFromClientInput,
  UpdateSolenoidFromMicroControllerInput,
} from './dto/update-solenoid.input';
import { IrrigationJob } from 'src/irrigation/entities/irrigation-job.entity';
import { IrrigationService } from 'src/irrigation/irrigation.service';
import { IrrigationJobsArgs } from './dto/irrigation-jobs.args';
import { ZoneIrrigationList } from './entities/zone-irrigation-list.entity';

@Resolver(() => Zone)
export class ZoneResolver {
  constructor(
    private readonly zoneService: ZoneService,
    private readonly irrigationService: IrrigationService,
  ) {}

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

  @ResolveField('irrigationJobs', () => [IrrigationJob], {
    description: 'Irrigation jobs for a given zone',
  })
  async getIrrigationJobsForZone(
    @Parent() zone: Zone,
    @Args() filter: IrrigationJobsArgs,
  ) {
    return this.irrigationService.getIrrigationJobsForZone(
      {
        zoneId: zone.id,
        active: typeof filter.active === 'undefined' ? null : filter.active,
      },
      {
        skip: filter.skip,
        take: filter.take,
      },
    );
  }

  @Query(() => Zone, { name: 'zone' })
  findById(@Args('id', { type: () => ID }) id: string) {
    return this.zoneService.getZoneById(id);
  }

  @Query(() => [Zone], { name: 'zones' })
  findAll() {
    return this.zoneService.getAllZones();
  }

  @Query(() => ZoneIrrigationList, { name: 'irrigationSummary' })
  irrigationSummary() {
    return this.zoneService.getIrrigationSummary();
  }

  @Mutation(() => Solenoid)
  updateSolenoidFromClient(
    @Args('updateSolenoidFromClientInput')
    input: UpdateSolenoidFromClientInput,
  ) {
    return this.zoneService.updateSolenoid({
      solenoidId: input.solenoidId,
      mode: input.mode,
      open: input.open,
      source: 'client',
      zoneId: input.zoneId,
    });
  }

  @Mutation(() => Solenoid)
  updateSolenoidFromMicroController(
    @Args('updateSolenoidFromMicroControllerInput')
    input: UpdateSolenoidFromMicroControllerInput,
  ) {
    return this.zoneService.updateSolenoid({
      solenoidId: input.solenoidId,
      mode: input.mode,
      open: input.open,
      source: 'micro-controller',
    });
  }
}

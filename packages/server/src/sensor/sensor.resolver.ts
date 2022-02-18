import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SensorService } from './sensor.service';
import { Sensor } from './entities/sensor.entity';
import { CreateSensorInput } from './dto/create-sensor.input';
import { UpdateSensorInput } from './dto/update-sensor.input';

@Resolver(() => Sensor)
export class SensorResolver {
  constructor(private readonly sensorService: SensorService) {}

  @Mutation(() => Sensor)
  createSensor(@Args('createSensorInput') createSensorInput: CreateSensorInput) {
    return this.sensorService.create(createSensorInput);
  }

  @Query(() => [Sensor], { name: 'sensor' })
  findAll() {
    return this.sensorService.findAll();
  }

  @Query(() => Sensor, { name: 'sensor' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.sensorService.findOne(id);
  }

  @Mutation(() => Sensor)
  updateSensor(@Args('updateSensorInput') updateSensorInput: UpdateSensorInput) {
    return this.sensorService.update(updateSensorInput.id, updateSensorInput);
  }

  @Mutation(() => Sensor)
  removeSensor(@Args('id', { type: () => Int }) id: number) {
    return this.sensorService.remove(id);
  }
}

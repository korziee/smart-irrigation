import {
  Args,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { SensorService } from './sensor.service';
import { Sensor } from './entities/sensor.entity';
import { SensorReadingInput } from './dto/sensor-reading.input';
import { SensorReading } from './entities/sensor-reading.entity';

@Resolver(() => Sensor)
export class SensorResolver {
  constructor(private readonly sensorService: SensorService) {}

  @ResolveField('readings', () => [SensorReading], { nullable: true })
  async readings(
    @Parent() sensor: Sensor,
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int, nullable: true }) skip = 0,
  ) {
    return this.sensorService.getReadingsForSensor(sensor.id, { take, skip });
  }

  @Mutation(() => SensorReading)
  sensorReading(
    @Args('sensorReadingInput')
    sensorReadingInput: SensorReadingInput,
  ) {
    return this.sensorService.createReading(
      sensorReadingInput.sensorId,
      sensorReadingInput.reading,
    );
  }
}

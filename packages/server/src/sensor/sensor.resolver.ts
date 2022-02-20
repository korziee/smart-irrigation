import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SensorService } from './sensor.service';
import { Sensor } from './entities/sensor.entity';
import { SensorReadingInput } from './dto/sensor-reading.input';
import { SensorReading } from './entities/sensor-reading.entity';

@Resolver(() => Sensor)
export class SensorResolver {
  constructor(private readonly sensorService: SensorService) {}

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

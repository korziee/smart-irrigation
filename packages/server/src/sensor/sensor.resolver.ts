import { Resolver } from '@nestjs/graphql';
import { SensorService } from './sensor.service';
import { Sensor } from './entities/sensor.entity';

@Resolver(() => Sensor)
export class SensorResolver {
  constructor(private readonly sensorService: SensorService) {}
}

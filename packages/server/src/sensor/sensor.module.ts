import { Module } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { SensorResolver } from './sensor.resolver';

@Module({
  providers: [SensorResolver, SensorService]
})
export class SensorModule {}

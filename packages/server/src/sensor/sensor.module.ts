import { Module } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { SensorResolver } from './sensor.resolver';
import { SensorRepository } from './sensor.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SensorResolver, SensorService, SensorRepository],
})
export class SensorModule {}

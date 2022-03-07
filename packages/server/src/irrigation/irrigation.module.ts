import { Module } from '@nestjs/common';
import { SensorModule } from '../sensor/sensor.module';
import { ZoneModule } from '../zone/zone.module';
import { PrismaModule } from '../prisma/prisma.module';
import { IrrigationRepository } from './irrigation.repository';
import { IrrigationService } from './irrigation.service';

@Module({
  imports: [PrismaModule, ZoneModule, SensorModule],
  providers: [IrrigationService, IrrigationRepository],
  exports: [IrrigationService],
})
export class IrrigationModule {}
import { forwardRef, Module } from '@nestjs/common';
import { SensorModule } from '../sensor/sensor.module';
import { ZoneModule } from '../zone/zone.module';
import { PrismaModule } from '../prisma/prisma.module';
import { IrrigationRepository } from './irrigation.repository';
import { IrrigationService } from './irrigation.service';
import { SolenoidModule } from 'src/solenoid/solenoid.module';

@Module({
  imports: [
    PrismaModule,
    SensorModule,
    SolenoidModule,
    forwardRef(() => ZoneModule),
  ],
  providers: [IrrigationService, IrrigationRepository],
  exports: [IrrigationService],
})
export class IrrigationModule {}

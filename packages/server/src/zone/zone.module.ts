import { forwardRef, Module } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { ZoneResolver } from './zone.resolver';
import { MicroControllerModule } from '../micro-controller/micro-controller.module';
import { ZoneRepository } from './zone.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { SolenoidModule } from '../solenoid/solenoid.module';
import { SensorModule } from '../sensor/sensor.module';
import { IrrigationModule } from 'src/irrigation/irrigation.module';

@Module({
  imports: [
    MicroControllerModule,
    SensorModule,
    PrismaModule,
    SolenoidModule,
    forwardRef(() => IrrigationModule),
  ],
  providers: [ZoneResolver, ZoneService, ZoneRepository],
  exports: [ZoneService],
})
export class ZoneModule {}

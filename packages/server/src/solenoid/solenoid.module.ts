import { Module } from '@nestjs/common';
import { SolenoidService } from './solenoid.service';
import { SolenoidResolver } from './solenoid.resolver';
import { SolenoidRepository } from './solenoid.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { MicroControllerModule } from '../micro-controller/micro-controller.module';
import { ZoneModule } from '../zone/zone.module';

@Module({
  imports: [PrismaModule, MicroControllerModule, ZoneModule],
  providers: [SolenoidResolver, SolenoidService, SolenoidRepository],
  exports: [SolenoidService],
})
export class SolenoidModule {}

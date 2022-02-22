import { Module } from '@nestjs/common';
import { SolenoidService } from './solenoid.service';
import { SolenoidResolver } from './solenoid.resolver';
import { SolenoidRepository } from './solenoid.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SolenoidResolver, SolenoidService, SolenoidRepository],
  exports: [SolenoidService],
})
export class SolenoidModule {}

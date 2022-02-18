import { Module } from '@nestjs/common';
import { SolenoidService } from './solenoid.service';
import { SolenoidResolver } from './solenoid.resolver';

@Module({
  providers: [SolenoidResolver, SolenoidService]
})
export class SolenoidModule {}

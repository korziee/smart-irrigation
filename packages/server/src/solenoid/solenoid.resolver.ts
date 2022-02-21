import { Resolver } from '@nestjs/graphql';
import { Solenoid } from './entities/solenoid.entity';

@Resolver(() => Solenoid)
export class SolenoidResolver {}

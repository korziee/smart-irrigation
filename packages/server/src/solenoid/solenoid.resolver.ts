import { Resolver } from '@nestjs/graphql';
import { Solenoid } from './entities/solenoid.entity';
import { SolenoidService } from './solenoid.service';

@Resolver(() => Solenoid)
export class SolenoidResolver {
  constructor(private readonly solenoidService: SolenoidService) {}
}

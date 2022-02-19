import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { SolenoidService } from './solenoid.service';
import { Solenoid } from './entities/solenoid.entity';
import { UpdateSolenoidInput } from './dto/update-solenoid.input';

@Resolver(() => Solenoid)
export class SolenoidResolver {
  constructor(private readonly solenoidService: SolenoidService) {}

  @Mutation(() => Solenoid)
  updateSolenoid(
    @Args('updateSolenoidInput') updateSolenoidInput: UpdateSolenoidInput,
  ) {
    return this.solenoidService.update(
      updateSolenoidInput.id,
      updateSolenoidInput,
    );
  }
}

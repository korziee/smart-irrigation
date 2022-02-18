import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SolenoidService } from './solenoid.service';
import { Solenoid } from './entities/solenoid.entity';
import { CreateSolenoidInput } from './dto/create-solenoid.input';
import { UpdateSolenoidInput } from './dto/update-solenoid.input';

@Resolver(() => Solenoid)
export class SolenoidResolver {
  constructor(private readonly solenoidService: SolenoidService) {}

  @Mutation(() => Solenoid)
  createSolenoid(@Args('createSolenoidInput') createSolenoidInput: CreateSolenoidInput) {
    return this.solenoidService.create(createSolenoidInput);
  }

  @Query(() => [Solenoid], { name: 'solenoid' })
  findAll() {
    return this.solenoidService.findAll();
  }

  @Query(() => Solenoid, { name: 'solenoid' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.solenoidService.findOne(id);
  }

  @Mutation(() => Solenoid)
  updateSolenoid(@Args('updateSolenoidInput') updateSolenoidInput: UpdateSolenoidInput) {
    return this.solenoidService.update(updateSolenoidInput.id, updateSolenoidInput);
  }

  @Mutation(() => Solenoid)
  removeSolenoid(@Args('id', { type: () => Int }) id: number) {
    return this.solenoidService.remove(id);
  }
}

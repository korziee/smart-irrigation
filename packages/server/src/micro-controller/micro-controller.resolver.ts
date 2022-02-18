import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MicroControllerService } from './micro-controller.service';
import { MicroController } from './entities/micro-controller.entity';
import { CreateMicroControllerInput } from './dto/create-micro-controller.input';
import { UpdateMicroControllerInput } from './dto/update-micro-controller.input';

@Resolver(() => MicroController)
export class MicroControllerResolver {
  constructor(private readonly microControllerService: MicroControllerService) {}

  @Mutation(() => MicroController)
  createMicroController(@Args('createMicroControllerInput') createMicroControllerInput: CreateMicroControllerInput) {
    return this.microControllerService.create(createMicroControllerInput);
  }

  @Query(() => [MicroController], { name: 'microController' })
  findAll() {
    return this.microControllerService.findAll();
  }

  @Query(() => MicroController, { name: 'microController' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.microControllerService.findOne(id);
  }

  @Mutation(() => MicroController)
  updateMicroController(@Args('updateMicroControllerInput') updateMicroControllerInput: UpdateMicroControllerInput) {
    return this.microControllerService.update(updateMicroControllerInput.id, updateMicroControllerInput);
  }

  @Mutation(() => MicroController)
  removeMicroController(@Args('id', { type: () => Int }) id: number) {
    return this.microControllerService.remove(id);
  }
}

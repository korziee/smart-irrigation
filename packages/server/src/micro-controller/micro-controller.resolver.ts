import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { MicroControllerService } from './micro-controller.service';
import { MicroController } from './entities/micro-controller.entity';
import { ControllerHeartbeatInput } from './dto/controller-heartbeat.input';
import { Config } from '../config/entities/config.entity';
import { ConfigService } from '../config/config.service';

@Resolver(() => MicroController)
export class MicroControllerResolver {
  constructor(
    private readonly microControllerService: MicroControllerService,
    private readonly configService: ConfigService,
  ) {}

  @ResolveField('config', () => Config, {
    nullable: true,
    description: 'Config for the micro controller',
  })
  async getConfigForController(@Parent() controller: MicroController) {
    return this.configService.findById(controller.configId);
  }

  @Mutation(() => MicroController)
  controllerHeartbeat(
    @Args('controllerHeartbeatInput')
    controllerHeartbeatInput: ControllerHeartbeatInput,
  ) {
    return this.microControllerService.handleControllerOnlineHook(
      controllerHeartbeatInput.id,
    );
  }
}

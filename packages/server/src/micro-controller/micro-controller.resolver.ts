import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { MicroControllerService } from './micro-controller.service';
import { MicroController } from './entities/micro-controller.entity';
import { ControllerHeartbeatInput } from './dto/controller-heartbeat.input';
import { Config } from '../config/entities/config.entity';
import { ConfigService } from '../config/config.service';
import { ControllerVoltageReadingInput } from './dto/controller-voltage-reading.input';

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
    @Context() context,
  ) {
    return this.microControllerService.handleControllerHeartbeat(
      controllerHeartbeatInput.id,
      context.req.socket.remoteAddress as string,
    );
  }

  @Mutation(() => Boolean)
  async controllerVoltageReading(
    @Args('controllerVoltageReadingInput') input: ControllerVoltageReadingInput,
  ) {
    await this.microControllerService.writeVoltageReading(
      input.controllerId,
      input.volts,
    );

    return true;
  }
}

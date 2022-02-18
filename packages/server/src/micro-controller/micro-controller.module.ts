import { Module } from '@nestjs/common';
import { MicroControllerService } from './micro-controller.service';
import { MicroControllerResolver } from './micro-controller.resolver';

@Module({
  providers: [MicroControllerResolver, MicroControllerService]
})
export class MicroControllerModule {}

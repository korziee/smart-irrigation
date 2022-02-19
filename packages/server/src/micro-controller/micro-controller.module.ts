import { Module } from '@nestjs/common';
import { MicroControllerService } from './micro-controller.service';
import { MicroControllerResolver } from './micro-controller.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { MicroControllerRepository } from './micro-controller.repository';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [
    MicroControllerResolver,
    MicroControllerService,
    MicroControllerRepository,
  ],
})
export class MicroControllerModule {}

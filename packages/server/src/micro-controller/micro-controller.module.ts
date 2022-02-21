import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { MicroControllerService } from './micro-controller.service';
import { MicroControllerResolver } from './micro-controller.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { MicroControllerRepository } from './micro-controller.repository';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [PrismaModule, ConfigModule, HttpModule],
  providers: [
    MicroControllerResolver,
    MicroControllerService,
    MicroControllerRepository,
  ],
  exports: [MicroControllerService],
})
export class MicroControllerModule {}

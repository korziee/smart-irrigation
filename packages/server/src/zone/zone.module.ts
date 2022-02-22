import { Module } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { ZoneResolver } from './zone.resolver';
import { MicroControllerModule } from '../micro-controller/micro-controller.module';
import { ZoneRepository } from './zone.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [MicroControllerModule, PrismaModule],
  providers: [ZoneResolver, ZoneService, ZoneRepository],
  exports: [ZoneService],
})
export class ZoneModule {}

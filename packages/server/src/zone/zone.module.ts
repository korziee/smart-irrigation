import { Module } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { ZoneResolver } from './zone.resolver';
import { MicroControllerModule } from 'src/micro-controller/micro-controller.module';

@Module({
  imports: [MicroControllerModule],
  providers: [ZoneResolver, ZoneService],
  exports: [ZoneService],
})
export class ZoneModule {}

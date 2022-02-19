import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigResolver } from './config.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigRepository } from './config.repository';

@Module({
  imports: [PrismaModule],
  providers: [ConfigResolver, ConfigService, ConfigRepository],
  exports: [ConfigService],
})
export class ConfigModule {}

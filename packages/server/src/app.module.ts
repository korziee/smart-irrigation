import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { MicroControllerModule } from './micro-controller/micro-controller.module';
import { SensorModule } from './sensor/sensor.module';
import { SolenoidModule } from './solenoid/solenoid.module';
import { ZoneModule } from './zone/zone.module';
import { ConfigModule } from './config/config.module';
import { IrrigationModule } from './irrigation/irrigation.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'generated/schema.graphql'),
      sortSchema: false,
    }),
    PrismaModule,
    MicroControllerModule,
    SensorModule,
    SolenoidModule,
    ZoneModule,
    ConfigModule,
    IrrigationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

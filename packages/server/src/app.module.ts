import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { MicroControllerModule } from './micro-controller/micro-controller.module';
import { SensorModule } from './sensor/sensor.module';
import { SolenoidModule } from './solenoid/solenoid.module';
import { ZoneModule } from './zone/zone.module';
import { ConfigModule as SmartIrrigationConfigModule } from './config/config.module';
import { IrrigationModule } from './irrigation/irrigation.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'generated/schema.graphql'),
      sortSchema: false,
      // easier to play around with the API when its deployed.
      playground: true,
      introspection: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    MicroControllerModule,
    SensorModule,
    SolenoidModule,
    ZoneModule,
    SmartIrrigationConfigModule,
    IrrigationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

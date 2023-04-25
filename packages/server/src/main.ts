import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IrrigationService } from './irrigation/irrigation.service';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get<PrismaService>(PrismaService);
  prismaService.enableShutdownHooks(app);

  await app.listen(3000);

  const irrigationService = app.get<IrrigationService>(IrrigationService);
  await irrigationService.startSmartIrrigation();

  // const r = app.get<IrrigationRepository>(IrrigationRepository);

  // // await r.createManyJobs([
  // //   {
  // //     zoneId: 'zone-1',
  // //     active: true,
  // //     end: new Date(),
  // //     start: new Date(),
  // //   },
  // // ]);
}

bootstrap();

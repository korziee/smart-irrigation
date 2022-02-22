import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';

import { AppModule } from '../../app.module';
import { v4 as uuidv4 } from 'uuid';
import { SolenoidService } from '../solenoid.service';
import { HttpService } from '@nestjs/axios';
import { mockDeep } from 'jest-mock-extended';

describe('Solenoid Module E2E', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue(mockDeep())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // this is mostly just a brain fart and doesn't scale, things to add
  //     proper seeding, use an integration database
  //     data cleanup
  //     method on solenoid repo to get solenoid instead of prisma
  //     e2e test through Graph instead of service directly
  it('should send a message to the remote micro-controller with the new state', async () => {
    const prisma = app.get<PrismaService>(PrismaService);

    const config = await prisma.config.create({
      data: {
        id: uuidv4(),
        soil_sensor_update_interval_ms: 1234,
      },
    });

    const controller = await prisma.controller.create({
      data: {
        id: uuidv4(),
        config_id: config.id,
        ip_address: 'localhost:4000',
      },
    });

    const zone = await prisma.zone.create({
      data: {
        id: uuidv4(),
        controller_id: controller.id,
      },
    });

    const solenoid = await prisma.solenoid.create({
      data: {
        id: uuidv4(),
        zone_id: zone.id,
      },
    });

    // TODO: replace with graphql mutation when the resolver exists
    const service = app.get(SolenoidService);

    // update solenoid
    await service.updateSolenoidState(solenoid.id, 'forced_on');

    expect(
      (app.get(HttpService) as jest.Mocked<HttpService>).post,
    ).toHaveBeenCalledWith('http://localhost:4000//update-solenoid', {
      state: 'forced_on',
    });

    const solenoidFromDb = await prisma.solenoid.findUnique({
      where: {
        id: solenoid.id,
      },
    });

    // validate
    expect(solenoidFromDb.state).toEqual('forced_on');
  });
});

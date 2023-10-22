import { Injectable } from '@nestjs/common';
import { controller } from '@smart-irrigation/prisma';

import { PrismaService } from '../prisma/prisma.service';
import { MicroController } from './entities/micro-controller.entity';

@Injectable()
export class MicroControllerRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapDbRowToConfig(dbRow: controller): MicroController {
    const controller = new MicroController();

    controller.id = dbRow.id;
    controller.configId = dbRow.config_id;
    controller.ipAddress = dbRow.ip_address;
    controller.lastBoot = dbRow.last_boot;
    controller.name = dbRow.name;
    controller.online = dbRow.online;

    return controller;
  }

  public async update(
    controllerId: string,
    update: Partial<Omit<controller, 'id'>>,
  ): Promise<MicroController> {
    const controller = await this.prisma.controller.update({
      where: {
        id: controllerId,
      },
      data: update,
    });

    return this.mapDbRowToConfig(controller);
  }

  public async writeVoltageReading(controllerId: string, reading: number) {
    return this.prisma.controller_battery_reading.create({
      data: {
        controller_id: controllerId,
        volts: reading,
      },
    });
  }

  public async findById(controllerId: string): Promise<MicroController> {
    const controller = await this.prisma.controller.findUnique({
      where: { id: controllerId },
    });

    return this.mapDbRowToConfig(controller);
  }

  public async findMany(query?: {
    lastBoot?: {
      lte?: Date;
    };
  }): Promise<MicroController[]> {
    const controllers = await this.prisma.controller.findMany({
      where: {
        last_boot: {
          lte: query?.lastBoot?.lte,
        },
      },
    });

    return controllers.map(this.mapDbRowToConfig);
  }
}

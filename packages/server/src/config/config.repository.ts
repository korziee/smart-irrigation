import { Injectable } from '@nestjs/common';
import { config } from '@smart-irrigation/prisma';

import { PrismaService } from '../prisma/prisma.service';
import { Config } from './entities/config.entity';

@Injectable()
export class ConfigRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapDbRowToConfig(dbRow: config): Config {
    const config = new Config();

    config.createdAt = dbRow.created_at;
    config.id = dbRow.id;
    config.soilSensorUpdateIntervalMs = dbRow.soil_sensor_update_interval_ms;
    config.controllerBatteryVoltageUpdateIntervalMs =
      dbRow.battery_voltage_update_interval_ms;
    config.devMode = {
      enabled: dbRow.dev_mode,
      ipAddress: dbRow.dev_mode_ip_address ?? '',
    };

    return config;
  }

  public async findById(configId: string): Promise<Config> {
    const config = await this.prisma.config.findUnique({
      where: {
        id: configId,
      },
    });

    if (!config) {
      throw new Error(`Could not find Config with id: ${configId}`);
    }

    return this.mapDbRowToConfig(config);
  }
}

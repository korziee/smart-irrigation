import { Injectable } from '@nestjs/common';
import type { Prisma, zone } from '@smart-irrigation/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { Zone } from './entities/zone.entity';

@Injectable()
export class ZoneRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapDbRowToZone(dbRow: zone): Zone {
    const zone = new Zone();

    zone.id = dbRow.id;
    zone.controllerId = dbRow.controller_id;
    zone.name = dbRow.name;

    return zone;
  }

  public async findMany(where?: Prisma.zoneFindManyArgs) {
    const zones = await this.prisma.zone.findMany(where);

    return zones.map(this.mapDbRowToZone);
  }

  public async findOne(zoneId: string): Promise<Zone> {
    const zone = await this.prisma.zone.findUnique({
      where: {
        id: zoneId,
      },
    });

    return this.mapDbRowToZone(zone);
  }
}

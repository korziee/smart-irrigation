import { Injectable } from '@nestjs/common';
import type { solenoid as solenoid_db_type } from '@smart-irrigation/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { Solenoid } from './entities/solenoid.entity';

@Injectable()
export class SolenoidRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapDbRowToSolenoid(dbRow: solenoid_db_type): Solenoid {
    const solenoid = new Solenoid();

    solenoid.id = dbRow.id;
    solenoid.state = dbRow.state;
    solenoid.zoneId = dbRow.zone_id;

    return solenoid;
  }

  public async updateState(
    solenoidId: string,
    state: Solenoid['state'],
  ): Promise<Solenoid> {
    const row = await this.prisma.solenoid.update({
      where: { id: solenoidId },
      data: {
        state,
      },
    });

    return this.mapDbRowToSolenoid(row);
  }
}

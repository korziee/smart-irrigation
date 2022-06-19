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
    solenoid.open = dbRow.open;
    solenoid.controlMode = dbRow.control_mode;
    solenoid.zoneId = dbRow.zone_id;

    return solenoid;
  }

  public async findById(id: string): Promise<Solenoid> {
    const row = await this.prisma.solenoid.findUnique({
      where: {
        id,
      },
      rejectOnNotFound: true,
    });

    return this.mapDbRowToSolenoid(row);
  }

  public async findMany(query?: { zoneId?: string }): Promise<Solenoid[]> {
    const results = await this.prisma.solenoid.findMany({
      where: {
        zone_id: query?.zoneId,
      },
    });

    return results.map(this.mapDbRowToSolenoid);
  }

  public async updateControlMode(
    solenoidId: string,
    controlMode: Solenoid['controlMode'],
  ): Promise<Solenoid> {
    const row = await this.prisma.solenoid.update({
      where: { id: solenoidId },
      data: {
        control_mode: controlMode,
      },
    });

    return this.mapDbRowToSolenoid(row);
  }

  public async update(
    update: Partial<Solenoid> & Pick<Solenoid, 'id'>,
  ): Promise<Solenoid> {
    const row = await this.prisma.solenoid.update({
      where: {
        id: update.id,
      },
      data: {
        zone_id: update.zoneId,
        open: update.open,
        control_mode: update.controlMode,
      },
    });

    return this.mapDbRowToSolenoid(row);
  }

  public async updateState(
    solenoidId: string,
    open: boolean,
  ): Promise<Solenoid> {
    const row = await this.prisma.solenoid.update({
      where: { id: solenoidId },
      data: {
        open,
      },
    });

    return this.mapDbRowToSolenoid(row);
  }
}

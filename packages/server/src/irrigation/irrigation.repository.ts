import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { irrigation_job, Prisma } from '@smart-irrigation/prisma';

import { PrismaService } from '../prisma/prisma.service';
import { IrrigationJob } from './entities/irrigation-job.entity';

@Injectable()
export class IrrigationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapDbRowToConfig(dbRow: irrigation_job): IrrigationJob {
    const job = new IrrigationJob();

    job.id = dbRow.id;
    job.zoneId = dbRow.zone_id;
    job.active = dbRow.active;
    job.start = dbRow.start;
    job.end = dbRow.end;

    return job;
  }

  public async createManyJobs(
    jobs: Array<Omit<IrrigationJob, 'id'>>,
  ): Promise<number> {
    const jobsWithIds = jobs.map(
      (job): Prisma.irrigation_jobCreateManyInput => ({
        id: uuidv4(),
        zone_id: job.zoneId,
        active: job.active,
        end: job.end,
        start: job.start,
      }),
    );

    const result = await this.prisma.irrigation_job.createMany({
      data: jobsWithIds,
    });

    return result.count;
  }

  public async findManyJobs(
    query: Prisma.irrigation_jobFindManyArgs,
  ): Promise<IrrigationJob[]> {
    const dbRows = await this.prisma.irrigation_job.findMany(query);

    return dbRows.map(this.mapDbRowToConfig);
  }

  public async markJobsAsInactive(jobIds: string[]): Promise<number> {
    const dbRows = await this.prisma.irrigation_job.updateMany({
      where: {
        id: {
          in: jobIds,
        },
      },
      data: {
        active: false,
      },
    });

    return dbRows.count;
  }

  public async getActiveJobs(): Promise<IrrigationJob[]> {
    const dbRows = await this.prisma.irrigation_job.findMany({
      where: {
        active: true,
      },
    });

    return dbRows.map(this.mapDbRowToConfig);
  }
}

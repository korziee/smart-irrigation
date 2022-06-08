import { Injectable } from '@nestjs/common';
import { Solenoid } from './entities/solenoid.entity';
import { SolenoidRepository } from './solenoid.repository';

@Injectable()
export class SolenoidService {
  constructor(private readonly solenoidRepository: SolenoidRepository) {}

  public async update(
    update: Partial<Solenoid> & Pick<Solenoid, 'id'>,
  ): Promise<Solenoid> {
    return this.solenoidRepository.update(update);
  }

  public async findMany(query?: { zoneId?: string }) {
    return this.solenoidRepository.findMany(query);
  }

  public async findById(id: string): Promise<Solenoid> {
    return this.solenoidRepository.findById(id);
  }
}

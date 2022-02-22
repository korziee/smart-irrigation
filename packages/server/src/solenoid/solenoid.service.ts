import { Injectable } from '@nestjs/common';
import { Solenoid } from './entities/solenoid.entity';
import { SolenoidRepository } from './solenoid.repository';

@Injectable()
export class SolenoidService {
  constructor(private readonly repository: SolenoidRepository) {}

  public async updateSolenoidState(
    solenoidId: string,
    state: Solenoid['state'],
  ): Promise<Solenoid> {
    const solenoid = await this.repository.updateState(solenoidId, state);

    return solenoid;
  }
}

import { Injectable } from '@nestjs/common';
import { ZoneService } from '../zone/zone.service';
import { MicroControllerService } from '../micro-controller/micro-controller.service';
import { Solenoid } from './entities/solenoid.entity';
import { SolenoidRepository } from './solenoid.repository';

@Injectable()
export class SolenoidService {
  constructor(
    private readonly repository: SolenoidRepository,
    private readonly microControllerService: MicroControllerService,
    private readonly zoneService: ZoneService,
  ) {}

  /**
   * Updates local and remote states
   */
  public async updateSolenoidState(
    solenoidId: string,
    state: Solenoid['state'],
  ): Promise<Solenoid> {
    // update state in repository
    const solenoid = await this.repository.updateState(solenoidId, state);

    const controller = await this.zoneService.getControllerForZone(
      solenoid.zoneId,
    );

    // tell controller to update remote state
    await this.microControllerService.sendControllerMessage(controller.id, {
      type: 'UPDATE_SOLENOID_STATE',
      data: {
        state,
      },
    });

    // return updated solenoid
    return solenoid;
  }
}

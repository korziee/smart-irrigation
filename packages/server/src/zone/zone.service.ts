import { Injectable } from '@nestjs/common';
import { MicroControllerService } from '../micro-controller/micro-controller.service';
import { MicroController } from '../micro-controller/entities/micro-controller.entity';
import { ZoneRepository } from './zone.repository';
import { SolenoidService } from '../solenoid/solenoid.service';
import { Solenoid } from '../solenoid/entities/solenoid.entity';

@Injectable()
export class ZoneService {
  constructor(
    private readonly repository: ZoneRepository,
    private readonly microControllerService: MicroControllerService,
    private readonly solenoidService: SolenoidService,
  ) {}

  public async getControllerForZone(zoneId: string): Promise<MicroController> {
    const zone = await this.repository.getZone(zoneId);

    return this.microControllerService.getControllerById(zone.controllerId);
  }

  /**
   * Updates local and remote states for the solenoid
   */
  public async updateSolenoidState(
    solenoidId: string,
    state: Solenoid['state'],
  ): Promise<Solenoid> {
    const solenoid = await this.solenoidService.updateSolenoidState(
      solenoidId,
      state,
    );

    const controller = await this.getControllerForZone(solenoid.zoneId);

    // tell controller to update remote state
    await this.microControllerService.sendControllerMessage(controller.id, {
      type: 'UPDATE_SOLENOID_STATE',
      data: {
        state,
      },
    });

    return solenoid;
  }
}

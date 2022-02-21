import { Injectable } from '@nestjs/common';
import { MicroControllerService } from '../micro-controller/micro-controller.service';
import { MicroController } from '../micro-controller/entities/micro-controller.entity';
import { ZoneRepository } from './zone.repository';

@Injectable()
export class ZoneService {
  constructor(
    private readonly repository: ZoneRepository,
    private readonly microControllerService: MicroControllerService,
  ) {}

  public async getControllerForZone(zoneId: string): Promise<MicroController> {
    const zone = await this.repository.getZone(zoneId);

    return this.microControllerService.getControllerById(zone.controllerId);
  }
}

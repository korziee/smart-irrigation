import { Injectable } from '@nestjs/common';
import { MicroController } from './entities/micro-controller.entity';
import { MicroControllerRepository } from './micro-controller.repository';

@Injectable()
export class MicroControllerService {
  constructor(private readonly repository: MicroControllerRepository) {}

  public async handleControllerOnlineHook(
    controllerId: string,
  ): Promise<MicroController> {
    console.log('here');
    return this.repository.update(controllerId, { online: true });
  }
}

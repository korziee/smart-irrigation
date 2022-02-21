import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { MicroController } from './entities/micro-controller.entity';
import { MicroControllerRepository } from './micro-controller.repository';
import { Message } from './types/Message';

@Injectable()
export class MicroControllerService {
  constructor(
    private readonly httpService: HttpService,
    private readonly repository: MicroControllerRepository,
  ) {}

  private readonly messageTypeRouteMap: Record<Message['type'], string> = {
    UPDATE_SOLENOID_STATE: '/update-solenoid',
    PLACE_HOLDER: '/placeholder',
  };

  public async handleControllerOnlineHook(
    controllerId: string,
  ): Promise<MicroController> {
    return this.repository.update(controllerId, { online: true });
  }

  public async sendControllerMessage(
    controllerId: string,
    message: Message,
  ): Promise<void> {
    const controller = await this.repository.findById(controllerId);

    const route = this.messageTypeRouteMap[message.type];

    await this.httpService.post(`${controller.ipAddress}/${route}`);
  }

  public async getControllerById(
    controllerId: string,
  ): Promise<MicroController> {
    return this.repository.findById(controllerId);
  }
}

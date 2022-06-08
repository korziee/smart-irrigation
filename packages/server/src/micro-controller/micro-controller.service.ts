import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { getIpv4AdressFromTransitionaryIpv6Address } from '../util/ip-address';
import { MicroController } from './entities/micro-controller.entity';
import { MicroControllerRepository } from './micro-controller.repository';
import { Message } from './types/Message';

@Injectable()
export class MicroControllerService {
  constructor(
    private readonly httpService: HttpService,
    private readonly repository: MicroControllerRepository,
    private readonly config: ConfigService,
  ) {}

  private readonly logger = new Logger(MicroControllerService.name);
  private jobTimerId: ReturnType<typeof setTimeout>;
  private readonly jobIntervalMs = 60000;

  private readonly messageTypeRouteMap: Record<Message['type'], string> = {
    UPDATE_SOLENOID_STATE: '/update-solenoid',
    PLACE_HOLDER: '/placeholder',
  };

  // should start a timer that fetches all controllers within the last x minutes that do not
  // have a last_boot time and mark them as offline
  // in the future this could be a sentry alert
  // public async startWatchingHeartbeat() {
  //   this.logger.verbose(`Starting heartbeat watcher`);

  //   try {
  //     // fetch all controllers within the last x minuets
  //   } catch (e) {
  //     this.logger.error('There was an error with the smart irrigation loop', e);
  //   }

  //   this.jobTimerId = setTimeout(
  //     () => this.startWatchingHeartbeat(),
  //     this.jobIntervalMs,
  //   );
  // }

  public async handleControllerHeartbeat(
    controllerId: string,
    remoteAddress: string,
  ): Promise<MicroController> {
    return this.repository.update(controllerId, {
      online: true,
      // The `remoteAddress` property on a socket seems to return a transitionary ipv6 address
      ip_address: getIpv4AdressFromTransitionaryIpv6Address(remoteAddress),
      last_boot: new Date(),
    });
  }

  public async sendControllerMessage(
    controllerId: string,
    message: Message,
  ): Promise<void> {
    const controller = await this.repository.findById(controllerId);

    this.logger.log('sendControllerMessage called', {
      message,
      route: this.messageTypeRouteMap[message.type],
    });

    if (this.config.get('ENV') === 'LOCAL') {
      this.logger.log(
        "Skipping HTTP request to controller as we're running in a local environment",
      );
      return;
    }

    if (!controller.ipAddress) {
      throw new Error(
        'Cannot send message to a micro-controller without an IP',
      );
    }

    const route = this.messageTypeRouteMap[message.type];

    const res = await lastValueFrom(
      this.httpService.post(
        `http://${controller.ipAddress}${route}`,
        message.data,
      ),
    );

    this.logger.log('MCU Response:', res);
  }

  public async getControllerById(
    controllerId: string,
  ): Promise<MicroController> {
    return this.repository.findById(controllerId);
  }
}

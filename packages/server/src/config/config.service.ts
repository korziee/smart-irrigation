import { Injectable } from '@nestjs/common';
import { ConfigRepository } from './config.repository';
import { Config } from './entities/config.entity';

@Injectable()
export class ConfigService {
  constructor(private readonly repository: ConfigRepository) {}

  public async findById(configId: string): Promise<Config> {
    return this.repository.findById(configId);
  }
}

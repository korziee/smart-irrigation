import { Resolver } from '@nestjs/graphql';
import { ConfigService } from './config.service';
import { Config } from './entities/config.entity';

@Resolver(() => Config)
export class ConfigResolver {
  constructor(private readonly configService: ConfigService) {}

  // @Mutation(() => Config)
  // createConfig(@Args('createConfigInput') createConfigInput: CreateConfigInput) {
  //   return this.configService.create(createConfigInput);
  // }

  // @Mutation(() => Config)
  // updateConfig(@Args('updateConfigInput') updateConfigInput: UpdateConfigInput) {
  //   return this.configService.update(updateConfigInput.id, updateConfigInput);
  // }
}

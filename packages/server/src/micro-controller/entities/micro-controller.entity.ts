import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class MicroController {
  @Field(() => ID, { description: 'Micro controller ID' })
  id: string;

  @Field({
    description: "The micro controller's friendly name",
  })
  name: string;

  @Field({ description: 'IP address of the micro controller', nullable: true })
  ipAddress?: string;

  @Field({
    description: 'Describes if the micro controller is online and active',
  })
  online: boolean;

  @Field({
    description: 'Describes if the micro controller is online and active',
    nullable: true,
  })
  lastBoot?: Date;

  @Field({
    description: 'ID of the config this controller should respect',
  })
  configId: string;
}

import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class MicroController {
  @Field(() => ID, { description: 'Micro controller ID' })
  id: string;

  @Field({ description: "The micro controller's friendly name" })
  name?: string;

  @Field({ description: 'IP address of the micro controller' })
  ipAddress?: number;

  @Field({
    description: 'Describes if the micro controller is online and active',
  })
  online: boolean;

  @Field(() => Date, {
    description: 'Describes if the micro controller is online and active',
  })
  lastBoot?: Date;
}

import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class ControllerHeartbeatInput {
  @Field(() => ID)
  id: string;
}

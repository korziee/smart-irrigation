import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class IrrigationJobsArgs {
  @Field()
  take: number;

  @Field({ nullable: true })
  skip?: number = 0;

  @Field({ nullable: true })
  active?: boolean;
}

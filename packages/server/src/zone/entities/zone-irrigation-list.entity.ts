import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ZoneIrrigationListItem {
  @Field(() => ID)
  zoneId: string;

  @Field()
  name: string;
}

@ObjectType()
export class ZoneIrrigationList {
  @Field(() => [ZoneIrrigationListItem])
  physical: ZoneIrrigationListItem[];

  @Field(() => [ZoneIrrigationListItem])
  smart: ZoneIrrigationListItem[];
}

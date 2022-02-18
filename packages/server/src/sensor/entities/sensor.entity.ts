import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { sensor_type } from '@smart-irrigation/prisma';
import type { sensor_type as SensorType } from '@smart-irrigation/prisma';

registerEnumType(sensor_type, {
  name: 'SensorType',
});

@ObjectType()
export class Sensor {
  @Field(() => ID, { description: 'Sensor ID' })
  id: string;

  @Field(() => ID, { description: 'Zone ID for which this sensor resides' })
  zoneId: string;

  @Field(() => sensor_type, { description: 'The type of sensor' })
  state: SensorType;
}

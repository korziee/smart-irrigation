import { InputType, Field, ID, registerEnumType } from '@nestjs/graphql';

const SolenoidClientControlModes = {
  client: 'client',
  auto: 'auto',
};

const SolenoidMicroControllerControlModes = {
  physical: 'physical',
  auto: 'auto',
};

registerEnumType(SolenoidClientControlModes, {
  name: 'SolenoidClientControlModes',
});

registerEnumType(SolenoidMicroControllerControlModes, {
  name: 'SolenoidMicroControllerControlModes',
});

@InputType()
class UpdateSolenoidInput {
  @Field(() => ID)
  solenoidId: string;

  @Field(() => Boolean)
  open: boolean;
}

@InputType()
export class UpdateSolenoidFromClientInput extends UpdateSolenoidInput {
  @Field(() => ID)
  zoneId: string;

  @Field(() => SolenoidClientControlModes)
  mode: keyof typeof SolenoidClientControlModes;
}

@InputType()
export class UpdateSolenoidFromMicroControllerInput extends UpdateSolenoidInput {
  @Field(() => ID)
  controllerId: string;

  @Field(() => SolenoidMicroControllerControlModes)
  mode: keyof typeof SolenoidMicroControllerControlModes;
}

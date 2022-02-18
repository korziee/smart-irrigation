export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateMicroControllerInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int'];
};

export type CreateSensorInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int'];
};

export type CreateSolenoidInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int'];
};

export type CreateZoneInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int'];
};

export type MicroController = {
  __typename?: 'MicroController';
  /** Example field (placeholder) */
  exampleField: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createMicroController: MicroController;
  createSensor: Sensor;
  createSolenoid: Solenoid;
  createZone: Zone;
  removeMicroController: MicroController;
  removeSensor: Sensor;
  removeSolenoid: Solenoid;
  removeZone: Zone;
  updateMicroController: MicroController;
  updateSensor: Sensor;
  updateSolenoid: Solenoid;
  updateZone: Zone;
};


export type MutationCreateMicroControllerArgs = {
  createMicroControllerInput: CreateMicroControllerInput;
};


export type MutationCreateSensorArgs = {
  createSensorInput: CreateSensorInput;
};


export type MutationCreateSolenoidArgs = {
  createSolenoidInput: CreateSolenoidInput;
};


export type MutationCreateZoneArgs = {
  createZoneInput: CreateZoneInput;
};


export type MutationRemoveMicroControllerArgs = {
  id: Scalars['Int'];
};


export type MutationRemoveSensorArgs = {
  id: Scalars['Int'];
};


export type MutationRemoveSolenoidArgs = {
  id: Scalars['Int'];
};


export type MutationRemoveZoneArgs = {
  id: Scalars['Int'];
};


export type MutationUpdateMicroControllerArgs = {
  updateMicroControllerInput: UpdateMicroControllerInput;
};


export type MutationUpdateSensorArgs = {
  updateSensorInput: UpdateSensorInput;
};


export type MutationUpdateSolenoidArgs = {
  updateSolenoidInput: UpdateSolenoidInput;
};


export type MutationUpdateZoneArgs = {
  updateZoneInput: UpdateZoneInput;
};

export type Query = {
  __typename?: 'Query';
  microController: MicroController;
  sensor: Sensor;
  solenoid: Solenoid;
  zone: Zone;
};


export type QueryMicroControllerArgs = {
  id: Scalars['Int'];
};


export type QuerySensorArgs = {
  id: Scalars['Int'];
};


export type QuerySolenoidArgs = {
  id: Scalars['Int'];
};


export type QueryZoneArgs = {
  id: Scalars['Int'];
};

export type Sensor = {
  __typename?: 'Sensor';
  /** Example field (placeholder) */
  exampleField: Scalars['Int'];
};

export type Solenoid = {
  __typename?: 'Solenoid';
  /** Example field (placeholder) */
  exampleField: Scalars['Int'];
};

export type UpdateMicroControllerInput = {
  /** Example field (placeholder) */
  exampleField?: InputMaybe<Scalars['Int']>;
  id: Scalars['Int'];
};

export type UpdateSensorInput = {
  /** Example field (placeholder) */
  exampleField?: InputMaybe<Scalars['Int']>;
  id: Scalars['Int'];
};

export type UpdateSolenoidInput = {
  /** Example field (placeholder) */
  exampleField?: InputMaybe<Scalars['Int']>;
  id: Scalars['Int'];
};

export type UpdateZoneInput = {
  /** Example field (placeholder) */
  exampleField?: InputMaybe<Scalars['Int']>;
  id: Scalars['Int'];
};

export type Zone = {
  __typename?: 'Zone';
  /** Example field (placeholder) */
  exampleField: Scalars['Int'];
};

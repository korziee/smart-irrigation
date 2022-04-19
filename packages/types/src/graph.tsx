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
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type Config = {
  __typename?: 'Config';
  /** Describes how often the controller should send sensor updates */
  createdAt: Scalars['DateTime'];
  /** Config ID */
  id: Scalars['ID'];
  /** Describes how often the controller should send sensor updates */
  soilSensorUpdateIntervalMs: Scalars['Float'];
};

export type ControllerHeartbeatInput = {
  id: Scalars['ID'];
};

export type MicroController = {
  __typename?: 'MicroController';
  /** Config for the micro controller */
  config?: Maybe<Config>;
  /** ID of the config this controller should respect */
  configId: Scalars['String'];
  /** Micro controller ID */
  id: Scalars['ID'];
  /** IP address of the micro controller */
  ipAddress?: Maybe<Scalars['String']>;
  /** Describes if the micro controller is online and active */
  lastBoot?: Maybe<Scalars['DateTime']>;
  /** The micro controller's friendly name */
  name?: Maybe<Scalars['String']>;
  /** Describes if the micro controller is online and active */
  online: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  controllerHeartbeat: MicroController;
  sensorReading: SensorReading;
  updateSolenoidMode: Solenoid;
};


export type MutationControllerHeartbeatArgs = {
  controllerHeartbeatInput: ControllerHeartbeatInput;
};


export type MutationSensorReadingArgs = {
  sensorReadingInput: SensorReadingInput;
};


export type MutationUpdateSolenoidModeArgs = {
  updateSolenoidModeInput: UpdateSolenoidModeInput;
};

export type Query = {
  __typename?: 'Query';
  zones: Array<Zone>;
};

export type Sensor = {
  __typename?: 'Sensor';
  /** Sensor ID */
  id: Scalars['ID'];
  readings?: Maybe<Array<SensorReading>>;
  /** The type of sensor */
  type: SensorType;
  /** Zone ID for which this sensor resides */
  zoneId: Scalars['ID'];
};


export type SensorReadingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  take: Scalars['Int'];
};

export type SensorReading = {
  __typename?: 'SensorReading';
  /** When this reading was created */
  createdAt: Scalars['DateTime'];
  /** Sensor Reading ID */
  id: Scalars['ID'];
  /** The actual sensor reading */
  reading: Scalars['Float'];
  /** The ID of the sensor from which this reading came */
  sensorId: Scalars['ID'];
};

export type SensorReadingInput = {
  reading: Scalars['Int'];
  sensorId: Scalars['ID'];
};

export enum SensorType {
  Moisture = 'moisture'
}

export type Solenoid = {
  __typename?: 'Solenoid';
  /** Describes if the solenoid is being controller manually or automatic */
  controlMode: SolenoidControlMode;
  /** ID of the Solenoid */
  id: Scalars['ID'];
  /** Describes if the solenoid is open or closed or not */
  open: Scalars['Boolean'];
  /** Zone ID for which this solenoid resides */
  zoneId: Scalars['ID'];
};

export enum SolenoidControlMode {
  Auto = 'auto',
  Manual = 'manual'
}

export type UpdateSolenoidModeInput = {
  id: Scalars['ID'];
  mode: SolenoidControlMode;
  open?: InputMaybe<Scalars['Boolean']>;
  zoneId: Scalars['ID'];
};

export type Zone = {
  __typename?: 'Zone';
  controller: MicroController;
  /** Controller ID for which this zone is controlled by */
  controllerId: Scalars['ID'];
  /** Zone ID */
  id: Scalars['ID'];
  /** Friendly name of the zone */
  name?: Maybe<Scalars['String']>;
  sensors: Array<Sensor>;
  solenoids: Array<Solenoid>;
};

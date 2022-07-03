import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
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

export type IrrigationJob = {
  __typename?: 'IrrigationJob';
  /** Whether or not the job is active */
  active: Scalars['Boolean'];
  /** Describes when the job should end */
  end: Scalars['DateTime'];
  /** Job ID */
  id: Scalars['ID'];
  /** Describes when the job started */
  start: Scalars['DateTime'];
  /** The ID of the zone this job is for */
  zoneId: Scalars['ID'];
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
  updateSolenoidFromClient: Solenoid;
  updateSolenoidFromMicroController: Solenoid;
};


export type MutationControllerHeartbeatArgs = {
  controllerHeartbeatInput: ControllerHeartbeatInput;
};


export type MutationSensorReadingArgs = {
  sensorReadingInput: SensorReadingInput;
};


export type MutationUpdateSolenoidFromClientArgs = {
  updateSolenoidFromClientInput: UpdateSolenoidFromClientInput;
};


export type MutationUpdateSolenoidFromMicroControllerArgs = {
  updateSolenoidFromMicroControllerInput: UpdateSolenoidFromMicroControllerInput;
};

export type Query = {
  __typename?: 'Query';
  irrigationSummary: ZoneIrrigationList;
  zone: Zone;
  zones: Array<Zone>;
};


export type QueryZoneArgs = {
  id: Scalars['ID'];
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
  /** Describes if the solenoid is being controlled manually or automatically */
  controlMode: SolenoidControlMode;
  /** ID of the Solenoid */
  id: Scalars['ID'];
  name: Scalars['String'];
  /** Describes if the solenoid is open or closed or not */
  open: Scalars['Boolean'];
  /** Zone ID for which this solenoid resides */
  zoneId: Scalars['ID'];
};

export enum SolenoidClientControlModes {
  Auto = 'auto',
  Client = 'client'
}

export enum SolenoidControlMode {
  Auto = 'auto',
  Client = 'client',
  Physical = 'physical'
}

export enum SolenoidMicroControllerControlModes {
  Auto = 'auto',
  Physical = 'physical'
}

export type UpdateSolenoidFromClientInput = {
  mode: SolenoidClientControlModes;
  open: Scalars['Boolean'];
  solenoidId: Scalars['ID'];
  zoneId: Scalars['ID'];
};

export type UpdateSolenoidFromMicroControllerInput = {
  controllerId: Scalars['ID'];
  mode: SolenoidMicroControllerControlModes;
  open: Scalars['Boolean'];
  solenoidId: Scalars['ID'];
};

export type Zone = {
  __typename?: 'Zone';
  controller: MicroController;
  /** Controller ID for which this zone is controlled by */
  controllerId: Scalars['ID'];
  /** Zone ID */
  id: Scalars['ID'];
  /** Irrigation jobs for a given zone */
  irrigationJobs: Array<IrrigationJob>;
  /** Friendly name of the zone */
  name: Scalars['String'];
  sensors: Array<Sensor>;
  solenoids: Array<Solenoid>;
};


export type ZoneIrrigationJobsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Float']>;
  take: Scalars['Float'];
};

export type ZoneIrrigationList = {
  __typename?: 'ZoneIrrigationList';
  physical: Array<ZoneIrrigationListItem>;
  smart: Array<ZoneIrrigationListItem>;
};

export type ZoneIrrigationListItem = {
  __typename?: 'ZoneIrrigationListItem';
  name: Scalars['String'];
  zoneId: Scalars['ID'];
};

export type ZoneControllerStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type ZoneControllerStatusQuery = { __typename?: 'Query', zones: Array<{ __typename?: 'Zone', id: string, name: string, controller: { __typename?: 'MicroController', id: string, lastBoot?: any | null, online: boolean, ipAddress?: string | null } }> };

export type IrrigationSummaryQueryVariables = Exact<{ [key: string]: never; }>;


export type IrrigationSummaryQuery = { __typename?: 'Query', irrigationSummary: { __typename?: 'ZoneIrrigationList', smart: Array<{ __typename?: 'ZoneIrrigationListItem', zoneId: string, name: string }>, physical: Array<{ __typename?: 'ZoneIrrigationListItem', zoneId: string, name: string }> } };

export type ZoneByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ZoneByIdQuery = { __typename?: 'Query', zone: { __typename?: 'Zone', id: string, name: string } };

export type ZoneListQueryVariables = Exact<{ [key: string]: never; }>;


export type ZoneListQuery = { __typename?: 'Query', zones: Array<{ __typename?: 'Zone', id: string, name: string }> };


export const ZoneControllerStatusDocument = gql`
    query ZoneControllerStatus {
  zones {
    id
    name
    controller {
      id
      lastBoot
      online
      ipAddress
    }
  }
}
    `;

/**
 * __useZoneControllerStatusQuery__
 *
 * To run a query within a React component, call `useZoneControllerStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useZoneControllerStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useZoneControllerStatusQuery({
 *   variables: {
 *   },
 * });
 */
export function useZoneControllerStatusQuery(baseOptions?: Apollo.QueryHookOptions<ZoneControllerStatusQuery, ZoneControllerStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ZoneControllerStatusQuery, ZoneControllerStatusQueryVariables>(ZoneControllerStatusDocument, options);
      }
export function useZoneControllerStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ZoneControllerStatusQuery, ZoneControllerStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ZoneControllerStatusQuery, ZoneControllerStatusQueryVariables>(ZoneControllerStatusDocument, options);
        }
export type ZoneControllerStatusQueryHookResult = ReturnType<typeof useZoneControllerStatusQuery>;
export type ZoneControllerStatusLazyQueryHookResult = ReturnType<typeof useZoneControllerStatusLazyQuery>;
export type ZoneControllerStatusQueryResult = Apollo.QueryResult<ZoneControllerStatusQuery, ZoneControllerStatusQueryVariables>;
export const IrrigationSummaryDocument = gql`
    query IrrigationSummary {
  irrigationSummary {
    smart {
      zoneId
      name
    }
    physical {
      zoneId
      name
    }
  }
}
    `;

/**
 * __useIrrigationSummaryQuery__
 *
 * To run a query within a React component, call `useIrrigationSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useIrrigationSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIrrigationSummaryQuery({
 *   variables: {
 *   },
 * });
 */
export function useIrrigationSummaryQuery(baseOptions?: Apollo.QueryHookOptions<IrrigationSummaryQuery, IrrigationSummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IrrigationSummaryQuery, IrrigationSummaryQueryVariables>(IrrigationSummaryDocument, options);
      }
export function useIrrigationSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IrrigationSummaryQuery, IrrigationSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IrrigationSummaryQuery, IrrigationSummaryQueryVariables>(IrrigationSummaryDocument, options);
        }
export type IrrigationSummaryQueryHookResult = ReturnType<typeof useIrrigationSummaryQuery>;
export type IrrigationSummaryLazyQueryHookResult = ReturnType<typeof useIrrigationSummaryLazyQuery>;
export type IrrigationSummaryQueryResult = Apollo.QueryResult<IrrigationSummaryQuery, IrrigationSummaryQueryVariables>;
export const ZoneByIdDocument = gql`
    query ZoneById($id: ID!) {
  zone(id: $id) {
    id
    name
  }
}
    `;

/**
 * __useZoneByIdQuery__
 *
 * To run a query within a React component, call `useZoneByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useZoneByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useZoneByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useZoneByIdQuery(baseOptions: Apollo.QueryHookOptions<ZoneByIdQuery, ZoneByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ZoneByIdQuery, ZoneByIdQueryVariables>(ZoneByIdDocument, options);
      }
export function useZoneByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ZoneByIdQuery, ZoneByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ZoneByIdQuery, ZoneByIdQueryVariables>(ZoneByIdDocument, options);
        }
export type ZoneByIdQueryHookResult = ReturnType<typeof useZoneByIdQuery>;
export type ZoneByIdLazyQueryHookResult = ReturnType<typeof useZoneByIdLazyQuery>;
export type ZoneByIdQueryResult = Apollo.QueryResult<ZoneByIdQuery, ZoneByIdQueryVariables>;
export const ZoneListDocument = gql`
    query ZoneList {
  zones {
    id
    name
  }
}
    `;

/**
 * __useZoneListQuery__
 *
 * To run a query within a React component, call `useZoneListQuery` and pass it any options that fit your needs.
 * When your component renders, `useZoneListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useZoneListQuery({
 *   variables: {
 *   },
 * });
 */
export function useZoneListQuery(baseOptions?: Apollo.QueryHookOptions<ZoneListQuery, ZoneListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ZoneListQuery, ZoneListQueryVariables>(ZoneListDocument, options);
      }
export function useZoneListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ZoneListQuery, ZoneListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ZoneListQuery, ZoneListQueryVariables>(ZoneListDocument, options);
        }
export type ZoneListQueryHookResult = ReturnType<typeof useZoneListQuery>;
export type ZoneListLazyQueryHookResult = ReturnType<typeof useZoneListLazyQuery>;
export type ZoneListQueryResult = Apollo.QueryResult<ZoneListQuery, ZoneListQueryVariables>;
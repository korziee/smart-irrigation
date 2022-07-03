import * as React from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { gql } from "@apollo/client";
import {
  SolenoidClientControlModes,
  SolenoidControlMode,
  useUpdateSolenoidMutation,
  useZoneByIdQuery,
} from "../../generated/graphql";
import { PageTemplate } from "../../components";
import { useSetTitle } from "../../contexts/navbar-title";
import { ControllerCard } from "./components/controller-card";
import { SolenoidCard } from "./components/solenoid-card";
import { MoistureLevelsCard } from "./components/moisture-levels-card";

export const GQL_ZONE = gql`
  query ZoneById($id: ID!) {
    zone(id: $id) {
      id
      name
      controller {
        id
        name
        online
      }
      solenoids {
        id
        controlMode
        open
        name
      }
      sensors {
        id
        type
        zoneId
        readings(take: 100) {
          id
          createdAt
          reading
          sensorId
        }
      }
    }
  }
`;

export const GQL_UPDATE_SOLENOID = gql`
  mutation UpdateSolenoid($input: UpdateSolenoidFromClientInput!) {
    updateSolenoidFromClient(updateSolenoidFromClientInput: $input) {
      id
      controlMode
      open
      name
    }
  }
`;

export const Zone: React.FC<RouteComponentProps> = () => {
  const params = useParams();

  const { loading, data } = useZoneByIdQuery({
    variables: { id: params.zoneId },
  });

  const [updateSolenoidMutation] = useUpdateSolenoidMutation();

  useSetTitle(data?.zone.name);

  if (loading || !data) {
    return null;
  }
  return (
    <PageTemplate>
      <ControllerCard {...data.zone.controller} />
      <MoistureLevelsCard sensors={data.zone.sensors!} />
      {data.zone.solenoids.map(({ controlMode, id, open, name }) => {
        return (
          <SolenoidCard
            key={id}
            mode={controlMode}
            open={open}
            name={name}
            onAutoModeRequested={() => {
              if (controlMode === SolenoidControlMode.Physical) {
                return;
              }

              updateSolenoidMutation({
                variables: {
                  input: {
                    mode: SolenoidClientControlModes.Auto,
                    open: false,
                    solenoidId: id,
                    zoneId: data.zone.id,
                  },
                },
              });
            }}
            onStateChangeRequested={(open: boolean) => {
              if (controlMode === SolenoidControlMode.Physical) {
                return;
              }

              updateSolenoidMutation({
                variables: {
                  input: {
                    mode: SolenoidClientControlModes.Client,
                    open: open,
                    solenoidId: id,
                    zoneId: data.zone.id,
                  },
                },
              });
            }}
          />
        );
      })}
    </PageTemplate>
  );
};

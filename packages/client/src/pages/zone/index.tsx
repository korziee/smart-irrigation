import * as React from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { gql } from "@apollo/client";
import { useZoneByIdQuery } from "../../generated/graphql";
import { PageTemplate } from "../../components";
import { useSetTitle } from "../../contexts/navbar-title";
import { ControllerCard } from "./components/controller-card";

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
    }
  }
`;

export const Zone: React.FC<RouteComponentProps> = () => {
  const params = useParams();

  const { loading, data } = useZoneByIdQuery({
    variables: { id: params.zoneId },
  });

  useSetTitle(data?.zone.name);

  if (loading || !data) {
    return null;
  }

  return (
    <PageTemplate>
      <ControllerCard {...data.zone.controller} />
    </PageTemplate>
  );
};

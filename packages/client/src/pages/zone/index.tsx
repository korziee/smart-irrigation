import * as React from "react";
import { useZoneByIdQuery } from "../../generated/graphql";
import { Link, RouteComponentProps, useParams } from "@reach/router";
import { gql } from "@apollo/client";
import { Button, Box, Typography } from "@mui/material";
import { PageTemplate } from "../../components";

export const GQL_ZONE = gql`
  query ZoneById($id: ID!) {
    zone(id: $id) {
      id
      name
    }
  }
`;

export const Zone: React.FC<RouteComponentProps> = () => {
  const params = useParams();

  const { loading, data } = useZoneByIdQuery({
    variables: { id: params.zoneId },
  });

  if (loading || !data) {
    return null;
  }

  return (
    <PageTemplate>
      <Typography variant="h4" gutterBottom>
        {data.zone.name}
      </Typography>
    </PageTemplate>
  );
};

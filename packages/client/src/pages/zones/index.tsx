import * as React from "react";
import { gql } from "@apollo/client";
import { Link, RouteComponentProps } from "@reach/router";
import { Button, Box, Typography, Card, CardContent } from "@mui/material";
import { useZoneListQuery } from "../../generated/graphql";
import { PageTemplate } from "../../components";

export const GQL_ZONE_LIST = gql`
  query ZoneList {
    zones {
      id
      name
    }
  }
`;

export const Zones: React.FC<RouteComponentProps> = () => {
  const { loading, data } = useZoneListQuery();

  if (loading || !data) {
    return null;
  }

  return (
    <PageTemplate>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Zones
          </Typography>
          <Box display="flex" flexDirection={"row"} alignItems="flex-start">
            {data.zones.map((zone) => (
              <Link to={`/zones/${zone.id}`}>
                <Button
                  variant="contained"
                  sx={{
                    mr: 1,
                  }}
                >
                  {zone.name}
                </Button>
              </Link>
            ))}
          </Box>
        </CardContent>
      </Card>
    </PageTemplate>
  );
};

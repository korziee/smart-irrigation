import React from "react";
import { gql } from "@apollo/client";
import { Card, CardContent, Typography, Box, Divider } from "@mui/material";
import {
  useZoneControllerStatusQuery,
  ZoneControllerStatusQuery,
} from "../../../generated/graphql";

export const GQL_ZONE_CONTROLLER_STATUS = gql`
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

export const ControllerStatusCard: React.FC = () => {
  const { loading, data } = useZoneControllerStatusQuery();

  if (loading || !data) {
    return null;
  }

  // hack lol
  const { offline, online } = data.zones.reduce<{
    offline: ZoneControllerStatusQuery["zones"][0][];
    online: ZoneControllerStatusQuery["zones"][0][];
  }>(
    (statusObject, zone) => {
      if (zone.controller.online) {
        statusObject.online.push(zone);
      } else {
        statusObject.offline.push(zone);
      }
      return statusObject;
    },
    {
      offline: [],
      online: [],
    }
  );

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography color="text.secondary" gutterBottom variant="h5">
          Zone Controller Status
        </Typography>
        <Box display="flex" flexDirection="row" mt={2}>
          <Box flex={1}>
            <Typography fontWeight="medium" mb={1}>
              Online
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography fontWeight="medium">Offline</Typography>
          </Box>
        </Box>
        <Divider light />
        <Box display="flex" flexDirection="row" mt={2}>
          <Box flex={1}>
            {online.length === 0 ? (
              <Typography fontStyle={"italic"}>None</Typography>
            ) : (
              online.map((zone) => {
                return <Typography key={zone.id}>{zone.name}</Typography>;
              })
            )}
          </Box>
          <Box flex={1}>
            {offline.length === 0 ? (
              <Typography fontStyle={"italic"}>None</Typography>
            ) : (
              offline.map((zone) => {
                return <Typography key={zone.id}>{zone.name}</Typography>;
              })
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

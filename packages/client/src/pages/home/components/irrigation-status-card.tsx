import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import { gql } from "@apollo/client";
import { useIrrigationSummaryQuery } from "../../../generated/graphql";

export const GQL_IRRIGATION_SUMMARY = gql`
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
      client {
        zoneId
        name
      }
    }
  }
`;

export const IrrigationStatusCard: React.FC = () => {
  const { loading, data } = useIrrigationSummaryQuery();

  if (loading || !data) {
    return null;
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography color="text.secondary" gutterBottom variant="h5">
          Currently Irrigating
        </Typography>
        <Box display="flex" flexDirection="row" mt={2}>
          <Box flex={1}>
            <Typography fontWeight="medium" mb={1}>
              Smart
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography fontWeight="medium">Physical</Typography>
          </Box>
          <Box flex={1}>
            <Typography fontWeight="medium">Manually</Typography>
          </Box>
        </Box>
        <Divider light />
        <Box display="flex" flexDirection="row" mt={2}>
          <Box flex={1}>
            {data.irrigationSummary.smart.length === 0 ? (
              <Typography fontStyle={"italic"}>None</Typography>
            ) : (
              data.irrigationSummary.smart.map((zone) => {
                return <Typography key={zone.zoneId}>{zone.name}</Typography>;
              })
            )}
          </Box>
          <Box flex={1}>
            {data.irrigationSummary.physical.length === 0 ? (
              <Typography fontStyle={"italic"}>None</Typography>
            ) : (
              data.irrigationSummary.physical.map((zone) => {
                return <Typography key={zone.zoneId}>{zone.name}</Typography>;
              })
            )}
          </Box>
          <Box flex={1}>
            {data.irrigationSummary.client.length === 0 ? (
              <Typography fontStyle={"italic"}>None</Typography>
            ) : (
              data.irrigationSummary.client.map((zone) => {
                return <Typography key={zone.zoneId}>{zone.name}</Typography>;
              })
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

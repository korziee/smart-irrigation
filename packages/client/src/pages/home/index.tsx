import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { RouteComponentProps } from "@reach/router";
import { Chip } from "@mui/material";

export const Home: React.FC<RouteComponentProps> = () => {
  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Currently Irrigating
          </Typography>
          <Box sx={{ display: "flex", flex: 1, alignItems: "center", mb: 1 }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Patch 1
            </Typography>
            <Chip label="Smart" size="small" color="info" />
          </Box>
          <Box sx={{ display: "flex", flex: 1, alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Patch 2
            </Typography>
            <Chip
              label="Physical"
              size="small"
              color="info"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

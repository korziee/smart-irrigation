import * as React from "react";
import Box from "@mui/material/Box";
import { RouteComponentProps } from "@reach/router";
import { IrrigationStatusCard, ControllerStatusCard } from "./components";

export const Home: React.FC<RouteComponentProps> = () => {
  return (
    <Box p={2}>
      <Box mb={2}>
        <IrrigationStatusCard />
      </Box>
      <Box mb={2}>
        <ControllerStatusCard />
      </Box>
    </Box>
  );
};

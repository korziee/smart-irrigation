import { Box } from "@mui/system";
import React from "react";

export const PageTemplate: React.FC = ({ children }) => {
  return <Box p={2}>{children}</Box>;
};

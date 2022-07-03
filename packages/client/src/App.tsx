import { CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/system";
import { RouteComponentProps, Router } from "@reach/router";
import React from "react";
import { NavBar } from "./components/nav-bar";
import { NavBarProvider } from "./contexts/navbar-title";
import { Home } from "./pages/home";
import { Zone } from "./pages/zone";
import { Zones } from "./pages/zones";

const theme = createTheme({
  palette: {
    background: {
      default: "#E1E2E1",
    },
    primary: {
      main: "#90caf9",
      light: "#c3fdff",
      dark: "#5d99c6",
      contrastText: "#000000",
    },
    secondary: {
      main: "#c8e6c9",
      light: "#fbfffc",
      dark: "#97b498",
      contrastText: "#000000",
    },
  },
});

const App: React.FC<RouteComponentProps> = ({ children }) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

const Main: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <NavBarProvider>
      <Router>
        <App path="/">
          <Home path="/" />
          <Zones path="/zones" />
          <Zone path="/zones/:zoneId" />
        </App>
      </Router>
    </NavBarProvider>
  </ThemeProvider>
);

export default Main;

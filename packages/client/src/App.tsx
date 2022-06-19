import { CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/system";
import { RouteComponentProps, Router, useParams } from "@reach/router";
import React from "react";
import { NavBar } from "./components/nav-bar";
import { Home } from "./pages/home";

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

const Zone: React.FC<RouteComponentProps> = () => {
  const params = useParams();
  return <div>Zone: {params.zoneId}</div>;
};

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
    <Router>
      <App path="/">
        <Home path="/" />
        <Zone path="/zones/:zoneId" />
      </App>
    </Router>
  </ThemeProvider>
);

export default Main;

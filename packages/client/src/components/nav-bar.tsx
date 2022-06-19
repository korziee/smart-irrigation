import React, { useState } from "react";
import { Link, useLocation } from "@reach/router";
import { Box } from "@mui/system";
import HomeIcon from "@mui/icons-material/Home";
import { Typography, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { routes } from "../routes";

const LINK_CENTER_STYLES = {
  display: "flex",
};

export const NavBar: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
      }}
    >
      <nav>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            m: 1,
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Link to={routes.home.path} style={LINK_CENTER_STYLES}>
              <HomeIcon />
            </Link>
            <Typography
              sx={{
                mx: 0.5,
              }}
            >
              /
            </Typography>
            <Typography>
              {Object.values(routes).find(({ path }) => {
                if (path === location.pathname) {
                  return true;
                }

                if (path === `/${location.pathname.split("/")[1]}`) {
                  return true;
                }

                return false;
              })?.name || "?"}
            </Typography>
          </Box>
          {menuOpen ? (
            <Box sx={{ position: "relative" }}>
              <MenuOpenIcon onClick={() => setMenuOpen(false)} />
              <Box
                sx={{
                  position: "absolute",
                  right: "0px",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: theme.palette.secondary.main,
                  p: 2,
                }}
              >
                <Link to={routes.home.path}>Home</Link>
                <Link to={routes.zones.path}>Zones</Link>
              </Box>
            </Box>
          ) : (
            <MenuIcon onClick={() => setMenuOpen(true)} />
          )}
        </Box>
      </nav>
    </Box>
  );
};

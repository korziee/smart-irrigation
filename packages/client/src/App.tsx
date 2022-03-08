import React from "react";

import { Zone } from "@smart-irrigation/types";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
});

const CustomPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#FFF",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  maxWidth: "600px",
  margin: "auto",
  minHeight: "100vh",
  color: theme.palette.text.secondary,
}));

const Wrapper = styled("div")(() => ({
  backgroundColor: "#1A2027",
}));

/**
 * Needs to show (for each zone):
 *  - solenoid state
 *  - sensor readings
 *
 * Needs to allow (for each zone):
 *  - manual override of each solenoid state
 */

function App() {
  function onClick() {
    client
      .query<{ zones: Zone[] }>({
        query: gql`
          query {
            zones {
              id
              controller {
                name
                ipAddress
                online
                lastBoot
                config {
                  soilSensorUpdateIntervalMs
                }
              }
              sensors {
                id
                type
                readings(take: 10) {
                  reading
                  createdAt
                }
              }
              solenoids {
                id
                zoneId
                state
              }
            }
          }
        `,
      })
      .then(({ data: { zones } }) => {
        for (const zone of zones) {
          console.log(1, zone);
          console.log("Zone ID = ", zone.id);
          console.log("Zone Controller = ", zone.controller);
          console.log("Zone Sensors = ", zone.sensors);
          console.log("Zone Solenoids = ", zone.solenoids);
        }
      });
  }
  return (
    <Wrapper>
      <CustomPaper>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button onClick={onClick}>Fetch</Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            hey 2
          </Grid>
          <Grid item xs={12} sm={6}>
            hey 3
          </Grid>
          <Grid item xs={12} sm={6}>
            hey 4
          </Grid>
        </Grid>
      </CustomPaper>
    </Wrapper>
  );
}

export default App;

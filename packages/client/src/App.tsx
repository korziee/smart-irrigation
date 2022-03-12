import React from "react";

import {
  Solenoid as SolenoidType,
  Zone as ZoneType,
  Sensor as SensorType,
  SolenoidControlMode,
} from "@smart-irrigation/types";

import FingerprintIcon from "@mui/icons-material/Fingerprint";
import TrafficIcon from "@mui/icons-material/Traffic";
import SensorsIcon from "@mui/icons-material/Sensors";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import InvertColorsOffIcon from "@mui/icons-material/InvertColorsOff";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import { useQuery, gql } from "@apollo/client";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  ButtonTypeMap,
} from "@mui/material";
import { Box } from "@mui/system";

const ZONE_QUERY = gql`
  query {
    zones {
      id
      name
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
        controlMode
        open
      }
    }
  }
`;

const CustomPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#FFF",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: "center",
  maxWidth: "600px",
  margin: "auto",
  minHeight: "100vh",
  color: theme.palette.text.secondary,
}));

const Wrapper = styled("div")(() => ({
  backgroundColor: "#1A2027",
}));

const CentredText = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const SolenoidStateButton: React.FC<{
  text: string;
  color: ButtonTypeMap["props"]["color"];
  onClick(): void;
  selected: boolean;
}> = ({ color, text, onClick, selected }) => {
  return (
    <Button
      onClick={onClick}
      fullWidth
      color={color}
      variant={selected ? "contained" : "outlined"}
    >
      {text}
    </Button>
  );
};

const SolenoidControlModeChanger: React.FC<{
  open: boolean;
  mode: SolenoidControlMode;
  onChange(mode: SolenoidControlMode, open?: boolean): void;
}> = ({ open, mode, onChange }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <SolenoidStateButton
          color="success"
          text="Force On"
          selected={mode === SolenoidControlMode.Manual && open}
          onClick={() => onChange(SolenoidControlMode.Manual, true)}
        />
      </Grid>
      <Grid item xs={4}>
        <SolenoidStateButton
          color="info"
          text="Auto"
          selected={mode === SolenoidControlMode.Auto}
          onClick={() => onChange(SolenoidControlMode.Auto)}
        />
      </Grid>
      <Grid item xs={4}>
        <SolenoidStateButton
          color="error"
          text="Force Off"
          selected={mode === SolenoidControlMode.Manual && !open}
          onClick={() => onChange(SolenoidControlMode.Manual, false)}
        />
      </Grid>
    </Grid>
  );
};

/**
 * Needs to show (for each zone):
 *  - solenoid state
 *  - sensor readings
 *
 * Needs to allow (for each zone):
 *  - manual override of each solenoid state
 */

const Solenoid: React.FC<{ solenoid: SolenoidType }> = ({ solenoid }) => {
  const SolenoidIcon = solenoid.open ? InvertColorsIcon : InvertColorsOffIcon;

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <CentredText>
          <FingerprintIcon sx={{ marginRight: "2px" }} />
          <Typography>{solenoid.id}</Typography>
        </CentredText>
      </Grid>
      <Grid item xs={12}>
        <CentredText>
          <SolenoidIcon sx={{ marginRight: "2px" }} />
          <Typography>{solenoid.open ? "Open" : "Closed"}</Typography>
        </CentredText>
      </Grid>
      <Grid item xs={12}>
        <Typography>State Changer</Typography>
        <SolenoidControlModeChanger
          mode={solenoid.controlMode}
          open={solenoid.open}
          onChange={console.log}
        />
      </Grid>
    </Grid>
  );
};

const Sensor: React.FC<{ sensor: SensorType }> = ({ sensor }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <CentredText>
          <FingerprintIcon sx={{ marginRight: "2px" }} />
          <Typography>{sensor.id}</Typography>
        </CentredText>
      </Grid>
      <Grid item xs={12}>
        <CentredText>
          <SensorsIcon sx={{ marginRight: "2px" }} />
          <Typography>{sensor.type}</Typography>
        </CentredText>
      </Grid>
    </Grid>
  );
};

const Zone: React.FC<{ zone: ZoneType }> = ({ zone }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" sx={{ marginBottom: 1 }}>
          {zone.name}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6">Solenoids</Typography>
            </Grid>
            {zone.solenoids.map((solenoid) => (
              <Grid item xs={12}>
                <Solenoid key={solenoid.id} solenoid={solenoid} />
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6">Sensors</Typography>
            </Grid>
            {zone.sensors.map((sensor, i) => (
              <Grid item xs={12}>
                <Sensor key={sensor.id} sensor={sensor} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

function App() {
  const { loading, error, data } = useQuery<{ zones: ZoneType[] }>(ZONE_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Wrapper>
      <CustomPaper>
        <Grid container spacing={2}>
          {data?.zones.map((zone) => (
            <Grid key={zone.id} item xs={12}>
              <Zone zone={zone} />
            </Grid>
          ))}
        </Grid>
      </CustomPaper>
    </Wrapper>
  );
}

export default App;

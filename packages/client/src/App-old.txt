/**
 * TODO: refactor me after POC
 * - page per concept
 * - homepage shows rough zone stats (irrigation job active, controller online, last reading, etc.)
 */

import React, { useState } from "react";

import {
  Solenoid as SolenoidType,
  Zone as ZoneType,
  Sensor as SensorType,
  MicroController as ControllerType,
  SolenoidControlMode,
} from "@smart-irrigation/types";

import { format, parseISO } from "date-fns";

import FingerprintIcon from "@mui/icons-material/Fingerprint";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import ComputerIcon from "@mui/icons-material/Computer";
import SensorsIcon from "@mui/icons-material/Sensors";
import ModeIcon from "@mui/icons-material/Mode";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import InvertColorsOffIcon from "@mui/icons-material/InvertColorsOff";
import SettingsIcon from "@mui/icons-material/Settings";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import { useQuery, gql, useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  ButtonTypeMap,
  Chip,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Snackbar,
} from "@mui/material";
import { Box } from "@mui/system";

const ZONE_QUERY = gql`
  query {
    zones {
      id
      name
      controller {
        id
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
        readings(take: 5) {
          id
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
      irrigationJobs(take: 5) {
        id
        start
        end
        active
      }
    }
  }
`;

const UPDATE_SOLENOID_STATE = gql`
  mutation UpdateSolenoidState($input: UpdateSolenoidFromClientInput!) {
    updateSolenoidFromClient(updateSolenoidFromClientInput: $input) {
      id
      zoneId
      controlMode
      open
    }
  }
`;

const CentreView = styled(Paper)(({ theme }) => ({
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
  disabled: boolean;
  selected: boolean;
}> = ({ color, text, onClick, selected, disabled }) => {
  return (
    <Button
      onClick={onClick}
      fullWidth
      disabled={disabled}
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
  disabled: boolean;
  onChange(mode: SolenoidControlMode, open?: boolean): void;
}> = ({ open, mode, onChange, disabled }) => {
  console.log("SolenoidControlModeChanger", open, mode);
  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <SolenoidStateButton
          disabled={disabled}
          color="success"
          text="Force On"
          selected={mode === SolenoidControlMode.Client && open}
          onClick={() => onChange(SolenoidControlMode.Client, true)}
        />
      </Grid>
      <Grid item xs={4}>
        <SolenoidStateButton
          disabled={disabled}
          color="info"
          text="Auto"
          selected={mode === SolenoidControlMode.Auto}
          onClick={() => onChange(SolenoidControlMode.Auto)}
        />
      </Grid>
      <Grid item xs={4}>
        <SolenoidStateButton
          disabled={disabled}
          color="error"
          text="Force Off"
          selected={mode === SolenoidControlMode.Client && !open}
          onClick={() => onChange(SolenoidControlMode.Client, false)}
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
  const [mutateFunction] = useMutation(UPDATE_SOLENOID_STATE);
  const [snackbarText, setSnackbarText] = useState("");

  const SolenoidIcon = solenoid.open ? InvertColorsIcon : InvertColorsOffIcon;

  return (
    <>
      <Snackbar
        open={!!snackbarText}
        message={snackbarText}
        autoHideDuration={10000}
        onClose={(event, reason) => {
          setSnackbarText("");
        }}
      />
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <CentredText>
            <FingerprintIcon sx={{ marginRight: 1 }} />
            <Typography>{solenoid.id}</Typography>
          </CentredText>
        </Grid>
        <Grid item xs={12}>
          <CentredText>
            <SolenoidIcon sx={{ marginRight: 1 }} />
            <Typography>{solenoid.open ? "Open" : "Closed"}</Typography>
          </CentredText>
        </Grid>
        <Grid item xs={12}>
          <CentredText>
            <SettingsIcon sx={{ marginRight: 1 }} />
            <Typography sx={{ textTransform: "capitalize" }}>
              {solenoid.controlMode}{" "}
              {solenoid.controlMode === SolenoidControlMode.Physical
                ? "(cannot update)"
                : ""}
            </Typography>
          </CentredText>
        </Grid>
        <Grid item xs={12}>
          <SolenoidControlModeChanger
            mode={solenoid.controlMode}
            open={solenoid.open}
            disabled={solenoid.controlMode === SolenoidControlMode.Physical}
            onChange={async (mode, open) => {
              try {
                await mutateFunction({
                  variables: {
                    input: {
                      solenoidId: solenoid.id,
                      zoneId: solenoid.zoneId,
                      mode:
                        mode === SolenoidControlMode.Auto ? "auto" : "client",
                      open: mode === SolenoidControlMode.Auto ? false : open,
                    },
                  },
                });
              } catch (e) {
                setSnackbarText((e as any).message);
                throw e;
              }
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

const Sensor: React.FC<{ sensor: SensorType }> = ({ sensor }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <CentredText>
          <FingerprintIcon sx={{ marginRight: 1 }} />
          <Typography>{sensor.id}</Typography>
        </CentredText>
      </Grid>
      <Grid item xs={12}>
        <CentredText>
          <SensorsIcon sx={{ marginRight: 1 }} />
          <Typography>{sensor.type}</Typography>
        </CentredText>
      </Grid>
      <Grid item xs={12}>
        <Typography>Readings</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Amount</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sensor.readings?.map(({ reading, createdAt, id }) => (
                <TableRow key={id}>
                  <TableCell>{reading}</TableCell>
                  <TableCell>
                    {format(parseISO(createdAt), "h:mm:ss aaa	(dd-MM-yyyy)")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

const Controller: React.FC<{ controller: ControllerType }> = ({
  controller: { id, online, name, ipAddress, lastBoot },
}) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <CentredText>
          <FingerprintIcon sx={{ marginRight: 1 }} />
          <Typography>{id}</Typography>
        </CentredText>
      </Grid>
      <Grid item xs={12}>
        <CentredText>
          <ModeIcon sx={{ marginRight: 1 }} />
          <Typography>{name}</Typography>
        </CentredText>
      </Grid>
      {ipAddress && (
        <Grid item xs={12}>
          <CentredText>
            <ComputerIcon sx={{ marginRight: 1 }} />
            <Typography>{ipAddress}</Typography>
          </CentredText>
        </Grid>
      )}
      {lastBoot && (
        <Grid item xs={12}>
          <CentredText>
            <CalendarIcon sx={{ marginRight: 1 }} />
            <Typography>Last Boot: {lastBoot}</Typography>
          </CentredText>
        </Grid>
      )}
      <Grid container item xs={12} spacing={1}>
        <Grid item>
          <Chip
            label={online ? "Online" : "Offline"}
            color={online ? "success" : "error"}
          />
        </Grid>
        {!ipAddress && (
          <Grid item>
            <Chip label={"No IP Address"} color={"error"} />
          </Grid>
        )}
        {!lastBoot && (
          <Grid item>
            <Chip label={"Never Booted"} color={"info"} />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

const Zone: React.FC<{ zone: ZoneType }> = ({ zone }) => {
  console.log("jobs", zone.irrigationJobs);
  return (
    <Box>
      <Typography variant="h4" sx={{ marginBottom: 1 }}>
        {zone.name}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6">Controller</Typography>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Controller controller={zone.controller} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6">Jobs</Typography>
            </Grid>
            {zone.irrigationJobs.map((job) => (
              <Grid item xs={12} key={job.id}>
                <Card>
                  <CardContent>
                    <Typography variant="body1">
                      Active: {job.active ? "true" : "false"}
                    </Typography>
                    <Typography variant="body1">Start: {job.start}</Typography>
                    <Typography variant="body1">End: {job.end}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h6">Solenoids</Typography>
          </Grid>
          {zone.solenoids.map((solenoid) => (
            <Grid item xs={12} key={solenoid.id}>
              <Card>
                <CardContent>
                  <Solenoid solenoid={solenoid} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h6">Sensors</Typography>
          </Grid>
          {zone.sensors.map((sensor) => (
            <Grid item xs={12} key={sensor.id}>
              <Card>
                <CardContent>
                  <Sensor sensor={sensor} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

function App() {
  const { loading, error, data, networkStatus } = useQuery<{
    zones: ZoneType[];
  }>(ZONE_QUERY, { pollInterval: 2000 });
  console.log("STAT", networkStatus);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Wrapper>
      <CentreView>
        <Grid container spacing={2}>
          {data?.zones.map((zone) => (
            <Grid key={zone.id} item xs={12}>
              <Zone zone={zone} />
            </Grid>
          ))}
        </Grid>
      </CentreView>
    </Wrapper>
  );
}

export default App;

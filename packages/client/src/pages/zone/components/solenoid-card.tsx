import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Box from "@mui/system/Box";
import OpacityIcon from "@mui/icons-material/Opacity";
import { SolenoidControlMode } from "../../../generated/graphql";

const controlMapNameMap: { [key in SolenoidControlMode]: string } = {
  auto: "smart",
  client: "manually",
  physical: "physical override",
};

function getButtonOpacityForSolenoidStateChangeButton(
  button: "smart" | "on" | "off",
  mode: SolenoidControlMode,
  open: boolean
): number {
  switch (button) {
    case "smart": {
      return mode === SolenoidControlMode.Physical ? 0.5 : 1;
    }
    case "on": {
      if (open || mode !== SolenoidControlMode.Physical) {
        return 1;
      }

      return 0.5;
    }
    case "off": {
      if (!open || mode !== SolenoidControlMode.Physical) {
        return 1;
      }

      return 0.5;
    }
  }
}

function getButtonVariantForSolenoidStateChangeButton(
  button: "smart" | "on" | "off",
  mode: SolenoidControlMode,
  open: boolean
): "outlined" | "contained" {
  switch (button) {
    case "smart": {
      return mode === SolenoidControlMode.Auto ? "contained" : "outlined";
    }
    case "on": {
      if (mode === SolenoidControlMode.Auto) {
        return "outlined";
      }

      return open ? "contained" : "outlined";
    }
    case "off": {
      if (mode === SolenoidControlMode.Auto) {
        return "outlined";
      }

      return open ? "outlined" : "contained";
    }
  }
}

export type SolenoidCardProps = {
  name: string;
  mode: SolenoidControlMode;
  open: boolean;
  onAutoModeRequested(): void;
  onStateChangeRequested(open: boolean): void;
};

/**
 * @note this does not show loading states, if you update the solenoid state it will spam the api
 */
export const SolenoidCard: React.FC<SolenoidCardProps> = ({
  name,
  mode,
  open,
  onAutoModeRequested,
  onStateChangeRequested,
}) => {
  return (
    <Box mb={2}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {name}
          </Typography>
          <Box display="flex" flexDirection="row" mb={2}>
            <OpacityIcon />
            <Typography ml={1}>
              {open ? "On" : "Off"} ({controlMapNameMap[mode]})
            </Typography>
          </Box>
          <Divider />
          <Typography variant="h6" my={1}>
            Controls
          </Typography>
          <Button
            fullWidth
            variant={getButtonVariantForSolenoidStateChangeButton(
              "smart",
              mode,
              open
            )}
            color="info"
            sx={{
              mb: 1.5,
              opacity: getButtonOpacityForSolenoidStateChangeButton(
                "smart",
                mode,
                open
              ),
            }}
            onClick={onAutoModeRequested}
          >
            Smart
          </Button>
          <Box display="flex">
            <Button
              fullWidth
              variant={getButtonVariantForSolenoidStateChangeButton(
                "on",
                mode,
                open
              )}
              color="success"
              sx={{
                mr: 0.75,
                opacity: getButtonOpacityForSolenoidStateChangeButton(
                  "on",
                  mode,
                  open
                ),
              }}
              onClick={() => {
                onStateChangeRequested(true);
              }}
            >
              On
            </Button>
            <Button
              fullWidth
              variant={getButtonVariantForSolenoidStateChangeButton(
                "off",
                mode,
                open
              )}
              color="error"
              sx={{
                ml: 0.75,
                opacity: getButtonOpacityForSolenoidStateChangeButton(
                  "off",
                  mode,
                  open
                ),
              }}
              onClick={() => {
                onStateChangeRequested(false);
              }}
            >
              Off
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

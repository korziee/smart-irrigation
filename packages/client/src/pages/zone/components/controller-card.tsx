import { Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import TrafficIcon from "@mui/icons-material/Traffic";

export type ControllerCardProps = {
  name: string;
  id: string;
  online: boolean;
};

export const ControllerCard: React.FC<ControllerCardProps> = ({
  id,
  name,
  online,
}) => {
  return (
    <Box mb={2}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Controller
          </Typography>
          <Box display="flex" flexDirection="row" my={1}>
            <LocalOfferIcon />
            <Typography ml={1}>{name}</Typography>
          </Box>
          <Box display="flex" flexDirection="row" my={1}>
            <FingerprintIcon />
            <Typography ml={1}>{id}</Typography>
          </Box>
          <Box display="flex" flexDirection="row" my={1}>
            <TrafficIcon color={online ? "success" : "warning"} />
            <Typography ml={1}>{online ? "Online" : "Offline"}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

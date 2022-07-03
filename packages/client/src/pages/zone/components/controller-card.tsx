import { Card, CardContent, Typography } from "@mui/material";

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
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Controller
        </Typography>
        <Typography>{name}</Typography>
        <Typography>{id}</Typography>
        <Typography>{online ? "online" : "offline"}</Typography>
      </CardContent>
    </Card>
  );
};

import { format, formatDistance, fromUnixTime } from "date-fns";
import { Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Sensor } from "../../../generated/graphql";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Legend,
  Tooltip,
} from "recharts";

export type MoistureLevelsCardProps = {
  sensors: Sensor[];
};

/**
 * TODO:
 * - add aggregated moisture content to zone
 */
export const MoistureLevelsCard: React.FC<MoistureLevelsCardProps> = ({
  sensors,
}) => {
  let min: Date | null = null;
  let max: Date | null = null;

  let sensorsWithSortedReadings = sensors.map((sensor) => {
    return {
      ...sensor,
      readings: [...sensor.readings!],
    };
  });

  sensorsWithSortedReadings.forEach((sensor) => {
    sensor.readings.sort((reading1, reading2) => {
      return new Date(reading1.createdAt) < new Date(reading2.createdAt)
        ? -1
        : 1;
    });
  });

  sensorsWithSortedReadings.forEach((sensor) => {
    sensor.readings.forEach((reading) => {
      const createdAt = new Date(reading.createdAt);
      if (!min || !max) {
        min = max = createdAt;
        return;
      }
      if (createdAt < min) {
        min = createdAt;
      }
      if (createdAt > max) {
        max = createdAt;
      }
    });
  });

  return (
    <Box mb={2}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Moisture Levels
          </Typography>
          <Typography mb={3}>
            Last reading taken&nbsp;
            {formatDistance(max!, new Date(), { addSuffix: true })}
          </Typography>
          <ResponsiveContainer height={300}>
            <LineChart
              // data={readings}
              // HACK: the <ResponsiveContainer /> is not so responsive
              margin={{ left: -25, right: 5 }}
            >
              <XAxis
                dataKey="time"
                tickFormatter={(time) => format(fromUnixTime(time), "HH:mm:ss")}
                domain={[
                  Math.floor(min!.getTime() / 1000),
                  Math.floor(max!.getTime() / 1000),
                ]}
                type="number"
              />
              <YAxis dataKey="reading" />
              <CartesianGrid strokeDasharray="2" />
              <Tooltip />
              <Legend />
              {sensorsWithSortedReadings.map(({ id, readings }) => {
                return (
                  <Line
                    stroke={`#${Math.floor(Math.random() * 16777215).toString(
                      16
                    )}`}
                    dataKey="reading"
                    data={readings.map((reading) => {
                      return {
                        id: reading.sensorId,
                        time: Math.floor(
                          new Date(reading.createdAt).getTime() / 1000
                        ),
                        reading: reading.reading,
                        sensorId: reading.sensorId,
                      };
                    })}
                    name={id.slice(0, 10)}
                    key={id.slice(0, 10)}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

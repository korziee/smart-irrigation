export type SensorReadingQuery = {
  take?: number;
  from?: Date;
  to?: Date;
  order?: 'asc' | 'desc';
};

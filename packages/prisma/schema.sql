-- not actual schema, but something close to what I'll have

CREATE TYPE "sensor_type" AS ENUM (
  'moisture'
);

CREATE TYPE "solenoid_state" AS ENUM (
  'on',
  'off',
  'forced_on',
  'forced_off'
);

CREATE TABLE "controller" (
  "controller_id" varchar PRIMARY KEY,
  "friendly_name" varchar,
  "ip_address" varchar,
  "online" boolean DEFAULT false,
  "last_boot" TIMESTAMP
);

CREATE TABLE "zone" (
  "zone_id" varchar PRIMARY KEY,
  "zone_name" varchar,
  "controller_id" varchar NOT NULL
);

CREATE TABLE "sensor" (
  "sensor_id" varchar PRIMARY KEY,
  "zone_id" varchar NOT NULL,
  "type" sensor_type NOT NULL
);

CREATE TABLE "sensor_reading" (
  "sensor_reading_id" varchar PRIMARY KEY,
  "sensor_id" varchar NOT NULL,
  "timestamp" timestamp NOT NULL DEFAULT now(),
  "reading" float NOT NULL
);

CREATE TABLE "solenoid" (
  "solenoid_id" varchar PRIMARY KEY,
  "zone_id" varchar NOT NULL,
  "state" solenoid_state NOT NULL DEFAULT 'off'
);

CREATE TABLE "config" (
  "soil_sensor_update_interval_ms" integer NOT NULL,
  "last_changed" timestamp DEFAULT now()
);

ALTER TABLE "zone" ADD FOREIGN KEY ("controller_id") REFERENCES "controller" ("controller_id");

ALTER TABLE "sensor" ADD FOREIGN KEY ("zone_id") REFERENCES "zone" ("zone_id");

ALTER TABLE "sensor_reading" ADD FOREIGN KEY ("sensor_id") REFERENCES "sensor" ("sensor_id");

ALTER TABLE "solenoid" ADD FOREIGN KEY ("zone_id") REFERENCES "zone" ("zone_id")
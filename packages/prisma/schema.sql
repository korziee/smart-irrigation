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

CREATE TABLE "config" (
  "id" varchar PRIMARY KEY,
  "soil_sensor_update_interval_ms" integer NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "controller" (
  "id" varchar PRIMARY KEY,
  "friendly_name" varchar,
  "ip_address" varchar,
  "online" boolean NOT NULL DEFAULT false,
  "last_boot" TIMESTAMP,
  "config_id" varchar NOT NULL
);

CREATE TABLE "zone" (
  "id" varchar PRIMARY KEY,
  "zone_name" varchar,
  "controller_id" varchar NOT NULL
);

CREATE TABLE "sensor" (
  "id" varchar PRIMARY KEY,
  "zone_id" varchar NOT NULL,
  "type" sensor_type NOT NULL
);

CREATE TABLE "sensor_reading" (
  "id" varchar PRIMARY KEY,
  "sensor_id" varchar NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "reading" float NOT NULL
);

CREATE TABLE "solenoid" (
  "id" varchar PRIMARY KEY,
  "zone_id" varchar NOT NULL,
  "state" solenoid_state NOT NULL DEFAULT 'off'
);

CREATE TABLE "irrigation_job" (
  "id" varchar PRIMARY KEY,
  "zone_id" varchar NOT NULL,
  "active" boolean NOT NULL,
  "start" timestamp NOT NULL,
  "end" timestamp NOT NULL
);

ALTER TABLE "zone" ADD FOREIGN KEY ("controller_id") REFERENCES "controller" ("id");
ALTER TABLE "sensor" ADD FOREIGN KEY ("zone_id") REFERENCES "zone" ("id");
ALTER TABLE "sensor_reading" ADD FOREIGN KEY ("sensor_id") REFERENCES "sensor" ("id");
ALTER TABLE "solenoid" ADD FOREIGN KEY ("zone_id") REFERENCES "zone" ("id");
ALTER TABLE "controller" ADD FOREIGN KEY ("config_id") REFERENCES "config" ("id");
ALTER TABLE "irrigation_job" ADD FOREIGN KEY ("zone_id") REFERENCES "zone" ("id");
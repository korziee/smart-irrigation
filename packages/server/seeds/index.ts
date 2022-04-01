import { PrismaClient } from '@smart-irrigation/prisma';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function seedConfig() {
  return prisma.config.create({
    data: {
      soil_sensor_update_interval_ms: 500,
    },
  });
}

function generateIds(amount: number) {
  const ids = [];

  for (let i = 0; i < amount; i += 1) {
    ids.push(uuidv4());
  }

  return ids;
}

async function seedControllers(configId: string): Promise<string[]> {
  const ids = generateIds(2);

  await prisma.controller.createMany({
    data: [
      {
        id: ids[0],
        config_id: configId,
        friendly_name: 'NodeMCU (no ip address)',
      },
      {
        id: ids[1],
        config_id: configId,
        friendly_name: 'NodeMCU',
        ip_address: '192.168.1.2',
        online: true,
        last_boot: new Date(),
      },
    ],
  });

  return ids;
}

export async function seedZones(controllerIds: string[]) {
  const ids = generateIds(2);

  await prisma.zone.createMany({
    data: [
      {
        id: ids[0],
        controller_id: controllerIds[0],
        name: 'my first zone',
      },
      {
        id: ids[1],
        controller_id: controllerIds[1],
        name: 'my second zone',
      },
    ],
  });

  return ids;
}

export async function seedSensors(zoneIds: string[]) {
  const ids = generateIds(3);

  await prisma.sensor.createMany({
    data: [
      {
        id: ids[0],
        type: 'moisture',
        zone_id: zoneIds[0],
      },
      {
        id: ids[1],
        type: 'moisture',
        zone_id: zoneIds[0],
      },
      {
        id: ids[2],
        type: 'moisture',
        zone_id: zoneIds[1],
      },
    ],
  });

  return ids;
}

export async function seedSolenoids(zoneIds: string[]) {
  const ids = generateIds(2);

  await prisma.solenoid.createMany({
    data: [
      {
        id: ids[0],
        zone_id: zoneIds[0],
      },
      {
        id: ids[1],
        zone_id: zoneIds[1],
      },
    ],
  });

  return ids;
}

export async function seedSensorReading(sensorIds: string[]) {
  const ids = generateIds(6);

  await prisma.sensor_reading.createMany({
    data: [
      {
        id: ids[0],
        reading: 100,
        sensor_id: sensorIds[0],
      },
      {
        id: ids[1],
        reading: 200,
        sensor_id: sensorIds[0],
      },
      {
        id: ids[2],
        reading: 300,
        sensor_id: sensorIds[0],
      },
      {
        id: ids[3],
        reading: 500,
        sensor_id: sensorIds[1],
      },
      {
        id: ids[4],
        reading: 100,
        sensor_id: sensorIds[1],
      },
      {
        id: ids[5],
        reading: 300,
        sensor_id: sensorIds[1],
      },
    ],
  });
}

export async function main() {
  const config = await seedConfig();
  const controllerIds = await seedControllers(config.id);
  const zoneIds = await seedZones(controllerIds);
  const sensorIds = await seedSensors(zoneIds);
  await seedSolenoids(zoneIds);
  await seedSensorReading(sensorIds);
}

try {
  main();
} catch (e) {
  console.error('There was an error seeding the database');
}

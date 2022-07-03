import { sub } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@smart-irrigation/prisma';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

function generateIds(amount: number) {
  const ids: string[] = [];

  for (let i = 0; i < amount; i += 1) {
    ids.push(uuidv4());
  }

  return ids;
}

export async function main() {
  const now = new Date();
  const sensorIds = [
    '09a51cc0-a543-41f2-af84-75324bb5d887',
    // '3d95711a-676e-4138-ac26-382fad73ad72',
  ];

  for (const sensorId of sensorIds) {
    const ids = generateIds(200);

    await prisma.sensor_reading.createMany({
      data: ids.map((id, index) => {
        return {
          reading: index,
          created_at: sub(now, {
            minutes: index,
          }),
          id,
          sensor_id: sensorId,
        };
      }),
    });
  }
}

try {
  main();
} catch (e) {
  console.error('There was an error seeding the database');
}

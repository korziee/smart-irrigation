import { PrismaClient } from '@smart-irrigation/prisma';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

/**
 * Seeds the real data, as provided to the actual controllers
 */
export async function main() {
  const response = await prisma.controller.create({
    data: {
      id: '6068d395-a94a-4a1b-8977-519819475e65',
      name: 'Test Controller',
      config: {
        create: {
          soil_sensor_update_interval_ms: 500,
        },
      },
      zone: {
        create: {
          id: 'defc8371-4106-4466-984f-ff05d1fd5e35',
          name: 'Test Zone',
          sensor: {
            createMany: {
              data: [
                {
                  id: '09a51cc0-a543-41f2-af84-75324bb5d887',
                  type: 'moisture',
                },
                {
                  id: '3d95711a-676e-4138-ac26-382fad73ad72',
                  type: 'moisture',
                },
              ],
            },
          },
          solenoid: {
            createMany: {
              data: [
                {
                  id: '85734b02-7c54-424a-9a4c-ebb00a696855',
                  control_mode: 'auto',
                  name: 'Test Solenoid 1',
                },
                {
                  id: 'a853bdc6-1301-49f9-ab2f-453bb2a3771b',
                  control_mode: 'auto',
                  name: 'Test Solenoid 2',
                },
              ],
            },
          },
        },
      },
    },
  });

  console.log('seeded', response);
}

try {
  main();
} catch (e) {
  console.error('There was an error seeding the database');
}

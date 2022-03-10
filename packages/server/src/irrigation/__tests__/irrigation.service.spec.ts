import { Test, TestingModule } from '@nestjs/testing';
import { sub, add } from 'date-fns';
import { SensorReading } from '../../sensor/entities/sensor-reading.entity';
import { Zone } from '../../zone/entities/zone.entity';
import { zoneServiceMockFactory } from '../../zone/mocks/zone.service.mock';
import { ZoneService } from '../../zone/zone.service';
import { IrrigationJob } from '../entities/irrigation-job.entity';
import { IrrigationRepository } from '../irrigation.repository';
import { IrrigationService } from '../irrigation.service';
import { irrigationRepositoryMockFactory } from '../mocks/irrigation.repository.mock';

describe('IrrigationService', () => {
  let service: IrrigationService;
  let irrigationRepository: ReturnType<typeof irrigationRepositoryMockFactory>;
  let zoneService: ReturnType<typeof zoneServiceMockFactory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IrrigationService,
        {
          provide: IrrigationRepository,
          useFactory: irrigationRepositoryMockFactory,
        },
        {
          provide: ZoneService,
          useFactory: zoneServiceMockFactory,
        },
      ],
    }).compile();

    service = module.get<IrrigationService>(IrrigationService);
    irrigationRepository = module.get(IrrigationRepository);
    zoneService = module.get(ZoneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('irrigateZonesIfRequired', () => {
    function mockGetInactiveZones() {
      // mocks getInactiveZonesFunction
      irrigationRepository.getActiveJobs.mockResolvedValue([
        { zoneId: '1' },
        { zoneId: '2' },
      ] as IrrigationJob[]);
      zoneService.getAllZones.mockResolvedValue([
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
      ] as Zone[]);
    }

    it('should not create a new irrigation job for a zone with an active irrigation job', async () => {
      mockGetInactiveZones();
      zoneService.getRecentSensorReadingsForZone.mockResolvedValue([
        {
          reading: 10,
        },
      ] as SensorReading[]);

      await service.irrigateZonesIfRequired();

      for (const call of irrigationRepository.createManyJobs.mock.calls) {
        for (const job of call[0]) {
          expect(job.zoneId).not.toBe('1');
          expect(job.zoneId).not.toBe('2');
        }
      }
    });

    it('should fetch the last 5 minutes of sensor readings for a zone when deciding to irrigate', async () => {
      const now = new Date();
      jest.useFakeTimers().setSystemTime(now.getTime());
      mockGetInactiveZones();

      zoneService.getRecentSensorReadingsForZone.mockResolvedValue([
        { reading: 10 },
      ] as SensorReading[]);

      await service.irrigateZonesIfRequired();

      expect(zoneService.getRecentSensorReadingsForZone).toHaveBeenCalledWith(
        '3',
        {
          from: sub(now, { minutes: 5 }),
        },
      );
    });

    // check that updateAllSolenoidsInZone and createManyJobs is called
    it('should only irrigate zones with an aggregated moisture level less than 250', async () => {
      const now = new Date();
      jest.useFakeTimers().setSystemTime(now.getTime());
      mockGetInactiveZones();

      zoneService.getRecentSensorReadingsForZone
        .calledWith('3', expect.anything())
        .mockResolvedValue([
          { reading: 200 },
          { reading: 280 },
        ] as SensorReading[]);

      zoneService.getRecentSensorReadingsForZone
        .calledWith('4', expect.anything())
        .mockResolvedValue([
          { reading: 500 },
          { reading: 300 },
        ] as SensorReading[]);

      await service.irrigateZonesIfRequired();

      // zone 4 is still moist in this test
      expect(zoneService.updateAllSolenoidsInZone).not.toHaveBeenCalledWith(
        '4',
        true,
      );
      expect(zoneService.updateAllSolenoidsInZone).toHaveBeenCalledWith(
        '3',
        true,
      );
      expect(irrigationRepository.createManyJobs).toHaveBeenCalledWith([
        {
          zoneId: '3',
          active: true,
          start: now,
          end: add(now, {
            minutes: 15,
          }),
        },
      ]);
    });
  });

  describe('handleExpiredJobs', () => {
    // bit wordy but couldn't get jest-mock-extended `calledWith` method to work correctly with nested object as param
    it('should query the repository for many jobs that are currently active and the current time is greater than their end date', async () => {
      irrigationRepository.findManyJobs.mockResolvedValue([]);

      const expectedDate = new Date();

      jest.useFakeTimers().setSystemTime(expectedDate.getTime());

      await service.handleExpiredJobs();

      expect(irrigationRepository.findManyJobs).toHaveBeenCalledWith({
        where: {
          active: true,
          end: {
            // this works because when you use fake timers in jest, the system clock doesn't advance
            lte: expectedDate,
          },
        },
      });
    });

    it('should ask the zone service to update all solenoids in the zone to be "off" if the job for that zone has expired', async () => {
      irrigationRepository.findManyJobs.mockResolvedValue([
        { id: '1', zoneId: 'zone-1', active: true } as IrrigationJob,
        { id: '2', zoneId: 'zone-2', active: true } as IrrigationJob,
      ]);

      await service.handleExpiredJobs();

      expect(zoneService.updateAllSolenoidsInZone).toHaveBeenCalledWith(
        'zone-1',
        false,
      );

      expect(zoneService.updateAllSolenoidsInZone).toHaveBeenCalledWith(
        'zone-2',
        false,
      );
    });

    it('should update the jobs in the database as inactive once they have expired', async () => {
      irrigationRepository.findManyJobs.mockResolvedValue([
        { id: '1', zoneId: 'zone-1', active: true } as IrrigationJob,
        { id: '2', zoneId: 'zone-2', active: true } as IrrigationJob,
      ]);

      await service.handleExpiredJobs();

      expect(irrigationRepository.markJobsAsInactive).toHaveBeenCalledWith([
        '1',
        '2',
      ]);
    });
  });
});

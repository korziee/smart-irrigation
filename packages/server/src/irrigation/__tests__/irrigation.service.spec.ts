import { Test, TestingModule } from '@nestjs/testing';
import { sensorServiceMockFactory } from '../../sensor/mocks/sensor.service.mock';
import { SensorService } from '../../sensor/sensor.service';
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
    it.todo(
      'should not create a new irrigation job for a zone with an active irrigation job',
    );

    it.todo(
      'should fetch the last 5 minutes of sensor readings for a zone when deciding to irrigate',
    );

    // check that updateAllSolenoidsInZone and createManyJobs is called
    it.todo(
      'should only irrigate zones with an aggregated moisture level less than 250',
    );
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
        'off',
      );

      expect(zoneService.updateAllSolenoidsInZone).toHaveBeenCalledWith(
        'zone-2',
        'off',
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

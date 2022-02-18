import { Injectable } from '@nestjs/common';
import { CreateSensorInput } from './dto/create-sensor.input';
import { UpdateSensorInput } from './dto/update-sensor.input';

@Injectable()
export class SensorService {
  create(createSensorInput: CreateSensorInput) {
    return 'This action adds a new sensor';
  }

  findAll() {
    return `This action returns all sensor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sensor`;
  }

  update(id: number, updateSensorInput: UpdateSensorInput) {
    return `This action updates a #${id} sensor`;
  }

  remove(id: number) {
    return `This action removes a #${id} sensor`;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateSolenoidInput } from './dto/create-solenoid.input';
import { UpdateSolenoidInput } from './dto/update-solenoid.input';

@Injectable()
export class SolenoidService {
  create(createSolenoidInput: CreateSolenoidInput) {
    return 'This action adds a new solenoid';
  }

  findAll() {
    return `This action returns all solenoid`;
  }

  findOne(id: number) {
    return `This action returns a #${id} solenoid`;
  }

  update(id: number, updateSolenoidInput: UpdateSolenoidInput) {
    return `This action updates a #${id} solenoid`;
  }

  remove(id: number) {
    return `This action removes a #${id} solenoid`;
  }
}

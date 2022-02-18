import { Injectable } from '@nestjs/common';
import { CreateMicroControllerInput } from './dto/create-micro-controller.input';
import { UpdateMicroControllerInput } from './dto/update-micro-controller.input';

@Injectable()
export class MicroControllerService {
  create(createMicroControllerInput: CreateMicroControllerInput) {
    return 'This action adds a new microController';
  }

  findAll() {
    return `This action returns all microController`;
  }

  findOne(id: number) {
    return `This action returns a #${id} microController`;
  }

  update(id: number, updateMicroControllerInput: UpdateMicroControllerInput) {
    return `This action updates a #${id} microController`;
  }

  remove(id: number) {
    return `This action removes a #${id} microController`;
  }
}

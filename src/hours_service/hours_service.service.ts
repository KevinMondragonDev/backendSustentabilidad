import { Injectable } from '@nestjs/common';
import { CreateHoursServiceDto } from './dto/create-hours_service.dto';
import { UpdateHoursServiceDto } from './dto/update-hours_service.dto';

@Injectable()
export class HoursServiceService {
  create(createHoursServiceDto: CreateHoursServiceDto) {
    return 'This action adds a new hoursService';
  }

  findAll() {
    return `This action returns all hoursService`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hoursService`;
  }

  update(id: number, updateHoursServiceDto: UpdateHoursServiceDto) {
    return `This action updates a #${id} hoursService`;
  }

  remove(id: number) {
    return `This action removes a #${id} hoursService`;
  }
}

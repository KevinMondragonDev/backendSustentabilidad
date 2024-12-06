import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HoursServiceService } from './hours_service.service';
import { CreateHoursServiceDto } from './dto/create-hours_service.dto';
import { UpdateHoursServiceDto } from './dto/update-hours_service.dto';

@Controller('hours-service')
export class HoursServiceController {
  constructor(private readonly hoursServiceService: HoursServiceService) {}

  @Post()
  create(@Body() createHoursServiceDto: CreateHoursServiceDto) {
    return this.hoursServiceService.create(createHoursServiceDto);
  }

  @Get()
  findAll() {
    return this.hoursServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hoursServiceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHoursServiceDto: UpdateHoursServiceDto) {
    return this.hoursServiceService.update(+id, updateHoursServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hoursServiceService.remove(+id);
  }
}

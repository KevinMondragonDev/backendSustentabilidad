import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('scholarships')
export class ScholarshipsController {
  constructor(private readonly scholarshipsService: ScholarshipsService) {}

  @Post()
  create(@Body() createScholarshipDto: CreateScholarshipDto) {
    return this.scholarshipsService.create(createScholarshipDto);
  }

  @Get()
  findAll(@Query() paginationDto:PaginationDto) {
    return this.scholarshipsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scholarshipsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScholarshipDto: UpdateScholarshipDto) {
    return this.scholarshipsService.update(+id, updateScholarshipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scholarshipsService.remove(+id);
  }
}

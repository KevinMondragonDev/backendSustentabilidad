import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Scholarship } from './entities/scholarship.entity';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Auth(ValidRoles.admin, ValidRoles.superUser)
@Controller('scholarships')
export class ScholarshipsController {
  constructor(private readonly scholarshipsService: ScholarshipsService) {}

  @ApiResponse({ status: 201, description: 'Scholarship check-status', type: Scholarship})
  @ApiResponse({ status: 400, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related issues' })
  @Post()
  create(@Body() createScholarshipDto: CreateScholarshipDto) {
    return this.scholarshipsService.create(createScholarshipDto);
  }


  @ApiResponse({ status: 201, description: 'Scholarship check-status', type: Scholarship})
  @ApiResponse({ status: 400, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related issues' }) 
  @Get()
  findAll(@Query() paginationDto:PaginationDto) {
    return this.scholarshipsService.findAll(paginationDto);
  }
  
  @ApiResponse({ status: 201, description: 'Scholarship ', type: Scholarship})
  @ApiResponse({ status: 400, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related issues' }) 
  @Get(':tipo_beca')
  findOne(@Param('tipo_beca') tipo_beca: string) {
    return this.scholarshipsService.findOne(tipo_beca);
  }

  @ApiResponse({ status: 201, description: 'Scholarship check-status', type: Scholarship})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related issues' }) 
  @Patch(':tipo_beca')
  update(@Param('tipo_beca') tipo_beca: string, @Body() updateScholarshipDto: UpdateScholarshipDto) {
    return this.scholarshipsService.update(tipo_beca, updateScholarshipDto);
  }

  @ApiResponse({ status: 201, description: 'Scholarship is delete', type: Scholarship})
  @ApiResponse({ status: 401, description: 'Unauthorized"' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related issues' }) 
  @Delete(':tipo_beca')
  remove(@Param('tipo_beca') tipo_beca: string) {
    return this.scholarshipsService.remove(tipo_beca);
  }
}

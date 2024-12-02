import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiResponse } from '@nestjs/swagger';
import { Student } from './entities/student.entity';

//* Todo este controlador es solo para Administradores
@Auth(ValidRoles.admin)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {} 

  @ApiResponse({ status: 201, description: 'Student check-status', type: Student})
  @ApiResponse({ status: 400, description: 'User undefined need a valid role [admin]' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related issues' })
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @ApiResponse({ status: 201, description: 'Student check-status', type: Student})
  @ApiResponse({ status: 400, description: 'User undefined need a valid role [admin]' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related issues' })
  @Get()
  findAll(@Query() paginationDto:PaginationDto) {
    return this.studentsService.findAll(paginationDto);
  }

  //*Es "term" dado a que buscaremos por matricula y/o nombre 
  @ApiResponse({ status: 201, description: 'Student check-status', type: Student})
  @ApiResponse({ status: 400, description: 'User undefined need a valid role [admin]' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related issues' })
  @Get(':term')
  findOne( @Param('term') term: string) {
    return this.studentsService.findOne(term);
  }

  @ApiResponse({ status: 201, description: 'Student check-status', type: Student})
  @ApiResponse({ status: 400, description: 'User undefined need a valid role [admin]' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related issues' })
  @Patch(':matricula')
  update(@Param('matricula') matricula: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(matricula, updateStudentDto);
  }

  @ApiResponse({ status: 201, description: 'The students is remove'})
  @ApiResponse({ status: 400, description: 'User undefined need a valid role [admin]' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related issues' })
  @Delete(':term')
  remove(@Param('term') term: string) {
    return this.studentsService.remove(term);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll(@Query() paginationDto:PaginationDto) {
    return this.studentsService.findAll(paginationDto);
  }

  //*Es "term" dado a que buscaremos por matricula y/o nombre 
  @Get(':term')
  findOne( @Param('term') term: string) {
    return this.studentsService.findOne(term);
  }


  @Patch(':matricula')
  update(@Param('matricula') matricula: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(matricula, updateStudentDto);
  }

  @Delete(':term')
  remove(@Param('term') term: string) {
    return this.studentsService.remove(term);
  }
}

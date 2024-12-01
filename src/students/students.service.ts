import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { error } from 'console';

@Injectable()
export class StudentsService {

  private readonly logger = new Logger("StudentsService")
  constructor(  
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    
   ){}

  async create(createStudentDto: CreateStudentDto) {
   try {
    const student = this.studentRepository.create(createStudentDto);
    await this.studentRepository.save(student);
    return student;

   } catch (error) {
      this.handleDBExceptions(error)
   }
  }

  findAll() {
    
  }
  async findOne(term:string) {
  
    let student: Student;
    student = await this.studentRepository.findOneBy({ matricula: term });
          
    if(!student){
      student = await this.studentRepository.findOneBy({ nombreCompleto: term.toUpperCase() });
      if(!student)
        throw new BadRequestException("the student is not found")
      return student;
    }
    return student; 
    }

  async update(matricula: string, updateStudentDto: UpdateStudentDto) {
    try {
      const student = await this.studentRepository.findOneBy({matricula:matricula})

      if(!student)
        throw new BadRequestException("The student is not found");

      const studentUpdate = await this.studentRepository.merge(student, updateStudentDto);
      await this.studentRepository.save(studentUpdate);
      return studentUpdate;
    } catch (error) {
      this.handleDBExceptions(error)
    }

  }

  async remove(term: string) {

    const student = await this.findOne(term);
    if(student)
      await this.studentRepository.remove(student);
    
    return "The students is remove"
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}

import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';

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

  findOne(term:string) {
    try {
      const student = this.studentRepository.findOneBy({matricula: term})
      return student;

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}

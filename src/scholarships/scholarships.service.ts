import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { Scholarship } from './entities/scholarship.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class ScholarshipsService {
  private readonly logger = new Logger("ScholarshipsService")
  constructor(
    @InjectRepository(Scholarship)
    private readonly scholarshipRepository:Repository<Scholarship>,
  ){}
  async create(createScholarshipDto: CreateScholarshipDto) {
    try {
      const scholarship = this.scholarshipRepository.create(createScholarshipDto);
      await this.scholarshipRepository.save(scholarship)
      return scholarship;
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  findAll(paginationDto:PaginationDto) {
   const {limit = 10 ,  offset= 0} = paginationDto;
   const scholarship = this.scholarshipRepository.find({
    take: limit,
    skip: offset
   })

    return scholarship;
  }

  findOne(id: number) {
    return `This action returns a #${id} scholarship`;
  }

  update(id: number, updateScholarshipDto: UpdateScholarshipDto) {
    return `This action updates a #${id} scholarship`;
  }

  remove(id: number) {
    return `This action removes a #${id} scholarship`;
  }


  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}

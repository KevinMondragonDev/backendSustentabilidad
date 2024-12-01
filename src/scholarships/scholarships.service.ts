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

  async findOne(tipo_beca:string) {
    try {
      const scholarship = await this.scholarshipRepository.findOneBy({tipo_beca:tipo_beca})

      if(!scholarship){
        throw new BadRequestException(`The scholarship is not found`)
      } 

      return scholarship;
    } catch (error) {
        this.handleDBExceptions(error)
    }
  }

  async update(tipo_beca:string, updateScholarshipDto: UpdateScholarshipDto) {
    try {
      const scholarship = await this.findOne(tipo_beca.toLocaleLowerCase().replaceAll(' ', '_').replaceAll("'", ''))

      if(!scholarship){
        throw new BadRequestException("Is not found")
      }

      let scholarshipUpdate = await this.scholarshipRepository.merge(scholarship, updateScholarshipDto);
      scholarshipUpdate.tipo_beca = scholarshipUpdate.tipo_beca.toLocaleLowerCase().replaceAll(' ', '_').replaceAll("'", '');      
      await this.scholarshipRepository.save(scholarshipUpdate);
      return scholarshipUpdate;
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async remove(tipo_beca:string) {

    const scholarship = await this.findOne(tipo_beca)
    if(scholarship){
      await this.scholarshipRepository.remove(scholarship) 
    }

    return scholarship;
  }


  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}

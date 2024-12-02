import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  Logger, 
  NotFoundException 
} from '@nestjs/common';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { Scholarship } from './entities/scholarship.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class ScholarshipsService {
  private readonly logger = new Logger('ScholarshipsService');

  constructor(
    @InjectRepository(Scholarship)
    private readonly scholarshipRepository: Repository<Scholarship>,
  ) {}

  async create(createScholarshipDto: CreateScholarshipDto) {
    try {
      const scholarship = this.scholarshipRepository.create(createScholarshipDto);
      await this.scholarshipRepository.save(scholarship);
      return scholarship;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.scholarshipRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(tipo_beca: string) {
    const cleanedTipoBeca = this.cleanTipoBeca(tipo_beca);
    const scholarship = await this.scholarshipRepository.findOneBy({ tipo_beca: cleanedTipoBeca });

    if (!scholarship) {
      throw new NotFoundException(`Scholarship with tipo_beca "${tipo_beca}" not found`);
    }

    return scholarship;
  }

  async update(tipo_beca: string, updateScholarshipDto: UpdateScholarshipDto) {
    const scholarship = await this.findOne(tipo_beca);
    this.scholarshipRepository.merge(scholarship, updateScholarshipDto);
    scholarship.tipo_beca = this.cleanTipoBeca(scholarship.tipo_beca);

    try {
      await this.scholarshipRepository.save(scholarship);
      return scholarship;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(tipo_beca: string) {
    const scholarship = await this.findOne(tipo_beca);

    try {
      await this.scholarshipRepository.remove(scholarship);
      return scholarship;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private cleanTipoBeca(tipo_beca: string): string {
    return tipo_beca.toLowerCase().replace(/[\s']/g, '_');
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}

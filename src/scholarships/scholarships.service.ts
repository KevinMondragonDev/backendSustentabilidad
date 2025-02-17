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
      const scholarship = this.scholarshipRepository.create( { ...createScholarshipDto, percentage_max_range: createScholarshipDto.percentage_max_range.join(',')}  );
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

  async findOne(scholarship_type: string) {
    const cleanedTipoBeca = this.cleanTipoBeca(scholarship_type);
    const scholarship = await this.scholarshipRepository.findOneBy({ scholarship_type: cleanedTipoBeca });

    if (!scholarship) {
      throw new NotFoundException(`Scholarship with scholarship_type "${scholarship_type}" not found`);
    }

    return scholarship;
  }

  async update(scholarship_type: string, updateScholarshipDto: UpdateScholarshipDto) {
    const scholarship = await this.findOne(scholarship_type);
    this.scholarshipRepository.merge(scholarship, {...updateScholarshipDto, percentage_max_range: updateScholarshipDto.percentage_max_range.join(',')});
    scholarship.scholarship_type = this.cleanTipoBeca(scholarship.scholarship_type);

    try {
      await this.scholarshipRepository.save(scholarship);
      return scholarship;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(scholarship_type: string) {
    const scholarship = await this.findOne(scholarship_type);

    try {
      await this.scholarshipRepository.remove(scholarship);
      return scholarship;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private cleanTipoBeca(scholarship_type: string): string {
    return scholarship_type.toLowerCase().replace(/[\s']/g, '_');
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}

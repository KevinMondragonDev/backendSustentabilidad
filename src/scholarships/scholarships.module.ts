import { Module } from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { ScholarshipsController } from './scholarships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scholarship } from './entities/scholarship.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Scholarship])],
  controllers: [ScholarshipsController],
  providers: [ScholarshipsService],
})
export class ScholarshipsModule {}

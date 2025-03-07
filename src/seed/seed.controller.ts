import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateSeedDto } from './dto/create-seed.dto';
import { SeedService } from './seed.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  create(@Body() createSeedDto: CreateSeedDto) {
    return this.seedService.create(createSeedDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ejecutar la carga inicial de datos de becas' })
  executeSeed() {
    return this.seedService.executeSeed();
  }
}
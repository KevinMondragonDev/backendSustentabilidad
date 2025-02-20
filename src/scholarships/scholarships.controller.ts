import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Scholarship } from './entities/scholarship.entity';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@ApiTags('Scholarships')
@Controller('scholarships')
export class ScholarshipsController {
  constructor(private readonly scholarshipsService: ScholarshipsService) {}

  @ApiOperation({ summary: 'Crear una beca' })
  @ApiResponse({ status: 201, description: 'Scholarship creada exitosamente', type: Scholarship })
  @ApiResponse({ status: 400, description: 'Bad Request - Datos incorrectos' })
  @ApiResponse({ status: 403, description: 'Forbidden - No autorizado' })
  @Auth(ValidRoles.admin)
  @Post()
  create(@Body() createScholarshipDto: CreateScholarshipDto) {
    return this.scholarshipsService.create(createScholarshipDto);
  }

  @ApiOperation({ summary: 'Obtener todas las becas con paginación' })
  @ApiResponse({ status: 200, description: 'Lista de becas obtenida correctamente', type: [Scholarship] })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.scholarshipsService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Obtener una beca por tipo' })
  @ApiResponse({ status: 200, description: 'Scholarship encontrada', type: Scholarship })
  @ApiResponse({ status: 404, description: 'Scholarship no encontrada' })
  @Get(':scholarship_type')
  findOne(@Param('scholarship_type') scholarship_type: string) {
    return this.scholarshipsService.findOne(scholarship_type);
  }

  @ApiOperation({ summary: 'Actualizar una beca' })
  @ApiResponse({ status: 200, description: 'Scholarship actualizada correctamente', type: Scholarship })
  @ApiResponse({ status: 400, description: 'Bad Request - Datos incorrectos' })
  @ApiResponse({ status: 404, description: 'Scholarship no encontrada' })
  @Auth(ValidRoles.admin)
  @Patch(':scholarship_type')
  update(@Param('scholarship_type') scholarship_type: string, @Body() updateScholarshipDto: UpdateScholarshipDto) {
    return this.scholarshipsService.update(scholarship_type, updateScholarshipDto);
  }

  @ApiOperation({ summary: 'Eliminar una beca' })
  @ApiResponse({ status: 200, description: 'Scholarship eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'Scholarship no encontrada' })
  @Auth(ValidRoles.admin)
  @Delete(':scholarship_type')
  remove(@Param('scholarship_type') scholarship_type: string) {
    return this.scholarshipsService.remove(scholarship_type);
  }
}

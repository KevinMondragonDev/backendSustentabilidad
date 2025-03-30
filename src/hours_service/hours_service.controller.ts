import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
  Headers,
  UnauthorizedException,
  Query
} from '@nestjs/common';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HoursServiceService } from './hours_service.service';
import { StartHoursDto, EndHoursServiceDto } from './dto';

@ApiTags('Hours Service')
@ApiBearerAuth()
@Controller('hours-service')
export class HoursServiceController {
  constructor(private readonly hoursServiceService: HoursServiceService) {}

  // Generar token QR (solo admin)
  @Post('generate-qr-token')
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 201, description: 'Token QR generado correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async generateQrToken() {
    return this.hoursServiceService.generateQrToken();
  }

    // Iniciar jornada con token QR
  @Post('start/:enrollment')
  @ApiResponse({ status: 201, description: 'Jornada iniciada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos de inicio inválidos' })
  @ApiResponse({ status: 401, description: 'Token QR inválido o expirado' })
  async startHoursService(
    @Param('enrollment') enrollment: string,
    @Body() startHoursDto: StartHoursDto
  ) {
    return this.hoursServiceService.startHoursService(enrollment, startHoursDto);
  }

  // Finalizar jornada con token QR
  @Post('end/:enrollment')
  @ApiResponse({ status: 201, description: 'Jornada finalizada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos de finalización inválidos' })
  @ApiResponse({ status: 401, description: 'Token QR inválido o expirado' })
  async endHoursService(
    @Param('enrollment') enrollment: string,
    @Body() endHoursDto: StartHoursDto
  ){
    return this.hoursServiceService.endHoursService(enrollment, endHoursDto);
  }

  // Obtener registros de horas por usuario
  @Get('records/:enrollment')
  @ApiResponse({ status: 200, description: 'Registros de horas obtenidos correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getHoursRecordsByUser(
    @Param('enrollment') enrollment: string){ 
    return this.hoursServiceService.getHoursRecordsByUser(enrollment);
  }

  // Obtener registros de horas por fecha
  @Get('records/date/:enrollment')
  @ApiResponse({ status: 200, description: 'Registros de horas obtenidos correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getHoursRecordsByUserByDate(
  @Param('enrollment') enrollment: string,
  @Query('month') month: number,
  @Query('year') year: number
  ) { 
  return this.hoursServiceService.getHoursRecordsByUserByDate(enrollment, month, year);
  }


}

    
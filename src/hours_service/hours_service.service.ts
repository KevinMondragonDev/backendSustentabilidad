import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException, 
  UnauthorizedException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { HoursService } from './entities/hours_service.entity';
import { validate } from 'class-validator';
import { StartHoursDto, EndHoursServiceDto } from './dto';
import { JwtPayload } from 'src/auth/interfaces';

@Injectable()
export class HoursServiceService {
  constructor(
    @InjectRepository(HoursService)
    private readonly hoursServiceRepository: Repository<HoursService>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ){}

  // Generar token para QR (expira en 5 minutos)
  async generateQrToken() {
    try {
      const payload = {
        sub: 'hours-service-qr',
        timestamp: new Date().getTime()
      };
      
      // Generar token que expira en 5 minutos
      const token = this.jwtService.sign(payload, {
        expiresIn: '5m'
      });
      
      return { 
        token,
        expiresIn: 300 
      };
    } catch (error) {
      console.log('Error al generar el token:', error);
      throw new InternalServerErrorException('No se pudo generar el token QR');
    }
  }

  // Validar token e iniciar jornada
  async startHoursService(enrollment: string, startHoursDto: StartHoursDto) {
    const { qrToken } = startHoursDto;
    
    try {
      // Verificar que el token sea válido
      const payload = this.jwtService.verify(qrToken);

      // Buscar el usuario
      const user = await this.userRepository.findOne({ where: { enrollment } });
      if (!user) throw new NotFoundException(`Usuario con matricula ${enrollment} no encontrado`);
      
      // Verificar si ya tiene una jornada activa
      const activeService = await this.hoursServiceRepository.findOne({
        where: {
          user: { enrollment: enrollment},
          isComplete: false
        }
      });
      
      if (activeService) {
        throw new BadRequestException('El usuario ya tiene una jornada activa');
      }
      
      // Crear registro de inicio de jornada
      const hoursService = this.hoursServiceRepository.create({
        start_date: new Date(),
        isComplete: false,
        user
      });
      
      await this.hoursServiceRepository.save(hoursService);
      
      return {
        message: 'Jornada iniciada correctamente',
        start_date: hoursService.start_date
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token QR inválido o expirado');
      }
      throw new InternalServerErrorException('Error al iniciar la jornada');
    }
  }
// Finalizar jornada
async endHoursService(enrollment: string, endHoursDto: EndHoursServiceDto) {
  const { qrToken } = endHoursDto;
  
  try {
    // Verificar que el token sea válido
    const payload = this.jwtService.verify(qrToken);
    
    // Buscar el usuario por matrícula primero
    const user = await this.userRepository.findOne({ where: { enrollment } });
    if (!user) throw new NotFoundException(`Usuario con matrícula ${enrollment} no encontrado`);
    
    // Buscar jornada activa del usuario
    const activeService = await this.hoursServiceRepository.findOne({
      where: {
        user: { enrollment: enrollment },
        isComplete: false
      }
    });
    
    if (!activeService) {
      throw new BadRequestException('El usuario no tiene una jornada activa');
    }

    console.log('Jornada encontrada:', activeService.id);
    activeService.end_date = new Date();
    activeService.isComplete = true;

    // Calcular duración en horas
    const startTime = new Date(activeService.start_date);
    const endTime = activeService.end_date;
    activeService.total_hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    await this.hoursServiceRepository.update(activeService.id, {
      end_date: activeService.end_date,
      isComplete: activeService.isComplete,
      total_hours: activeService.total_hours
    });

    console.log('Jornada actualizada correctamente');

    // Verificar que se guardó correctamente
    const verificacionJornada = await this.hoursServiceRepository.findOne({ 
      where: { id: activeService.id } 
    });

    if (!verificacionJornada || !verificacionJornada.isComplete) {
      console.error('Error: La jornada no se guardó correctamente');
      throw new InternalServerErrorException('Error al guardar los datos de la jornada');
    }

    console.log('Verificación exitosa de guardado de jornada');
    
    const totalHoursWhole = Math.floor(activeService.total_hours);
    const totalMinutes = Math.round((activeService.total_hours - totalHoursWhole) * 60);
    const formattedTotalHours = totalMinutes > 0 
      ? `${totalHoursWhole} horas y ${totalMinutes} minutos` 
      : `${totalHoursWhole} horas`;

    return {
      message: 'Jornada finalizada correctamente',
      end_date: activeService.end_date,
      total_hours: formattedTotalHours
    };

  } catch (error) {
    console.error('Error en el proceso:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Token QR inválido o expirado');
    }
    throw new InternalServerErrorException('Error al finalizar la jornada');
  }
}


// Obtener registros de horas por usuario
async getHoursRecordsByUser(enrollment: string) {
  try {
    // Verificar que el usuario existe
    const user = await this.userRepository.findOne({ where: { enrollment } });
    if (!user) throw new NotFoundException(`Usuario con matrícula ${enrollment} no encontrado`);
    
    // Buscar todos los registros de horas del usuario
    const hoursRecords = await this.hoursServiceRepository.find({
      where: { user: { enrollment: enrollment } },
      order: { start_date: 'DESC' } // Ordenados por fecha de inicio (más reciente primero)
    });
    
    // Calcular estadísticas
    let totalCompletedHours = 0;
    let pendingHours = 0;
    
    hoursRecords.forEach(record => {
      if (record.isComplete && record.total_hours) {
        totalCompletedHours += Number(record.total_hours);
      }
    });
    
    // Obtener horas adeudadas del usuario
    pendingHours = Number(user.owed_hours || 0);
    // Formatear las horas pendientes
    const pendingHoursWhole = Math.floor(pendingHours);
    const pendingMinutes = Math.round((pendingHours - pendingHoursWhole) * 60);
    const formattedPendingHours = pendingMinutes > 0 
      ? `${pendingHoursWhole} horas y ${pendingMinutes} minutos` 
      : `${pendingHoursWhole} horas`;
    
    return {
      user: {
        enrollment: user.enrollment,
        name: user.fullName
      },
      totalRecords: hoursRecords.length,
      completedHours: totalCompletedHours,
      pendingHoursFormatted: formattedPendingHours,
      hoursRecords: hoursRecords.map(record => ({
        start_date: record.start_date,
        end_date: record.end_date,
        total_hours: record.total_hours,
        isComplete: record.isComplete
      }))
    };
  } catch (error) {
    console.log('Error al obtener registros de horas:', error);
    throw new InternalServerErrorException('Error al obtener los registros de horas');
  }
}

async getHoursRecordsByUserByDate(enrollment: string, month: number, year: number){
  try{
    const user = await this.userRepository.findOne({where: { enrollment }});
    if(!user) throw new NotFoundException(`Usuario con matrícula ${enrollment} no encontrado`);

    const hourRecords = await this.hoursServiceRepository.createQueryBuilder('hoursService')
    .where('hoursService.user = :userId', { userId: user.id })
    .andWhere('EXTRACT(MONTH FROM hoursService.start_date) = :month', { month })
    .andWhere('EXTRACT(YEAR FROM hoursService.start_date) = :year', { year })
    .orderBy('hoursService.start_date', 'DESC')
    .getMany();
    if(hourRecords.length === 0) throw new NotFoundException(`No se encontraron registros de horas para el usuario ${enrollment} en ${month}/${year}`);

    let totalCompletedHours = 0;

    hourRecords.forEach(record => {
      if(record.isComplete && record.total_hours){
        totalCompletedHours += Number(record.total_hours);
      }
    });
    return {
      user: {
        enrollment: user.enrollment,
        name: user.fullName
      },
      totalRecords: hourRecords.length,
      completedHours: totalCompletedHours,
      hourRecords: hourRecords.map(record => ({
        start_date: record.start_date,
        end_date: record.end_date,
        total_hours: record.total_hours,
        isComplete: record.isComplete
      }))
    }
  }
  catch (error) {
    console.log('Error al obtener registros de horas por fecha:', error);
    throw new InternalServerErrorException('Error al obtener los registros de horas por fecha');
  }
}
}
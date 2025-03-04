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
      // Crear un payload único con timestamp para evitar duplicados
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
        expiresIn: 300 // 5 minutos en segundos
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
          user: { enrollment: enrollment },
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
    
    // Actualizar con hora de finalización
    activeService.end_date = new Date();
    activeService.isComplete = true;
    
    // Calcular duración en horas
    const startTime = new Date(activeService.start_date);
    const endTime = new Date(activeService.end_date);
    const totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    
    activeService.total_hours = totalHours;
    
    await this.hoursServiceRepository.save(activeService);

    // Actualizar las horas adeudadas del usuario
    if (user.owed_hours > 0) {
      // Restamos las horas realizadas de las adeudadas, pero no menos de cero
      const newOwedHours = Math.max(0, Number(user.owed_hours) - totalHours);
      user.owed_hours = newOwedHours;
      await this.userRepository.save(user);
    }
    
    return {
      message: 'Jornada finalizada correctamente',
      start_date: activeService.start_date,
      end_date: activeService.end_date,
      total_hours: `${totalHours.toFixed(2)} horas`
    };
  } catch (error) {
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
    
    return {
      user: {
        enrollment: user.enrollment,
        name: user.fullName
      },
      totalRecords: hoursRecords.length,
      completedHours: totalCompletedHours,
      pendingHours: pendingHours,
      hoursRecords: hoursRecords.map(record => ({
        id: record.id,
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
}
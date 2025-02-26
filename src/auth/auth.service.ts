import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException, 
  UnauthorizedException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';  
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Scholarship } from '../scholarships/entities/scholarship.entity';
import { LoginUserDto, CreateUserDto, UpdatePenalizedDto } from './dto';
import { DesactivateUserDto } from './dto/update-user.dto';
import { JwtPayload } from './interfaces/jwt.payload.interface';

bcrypt.setRandomFallback((size: number) => {
  const buf = new Uint8Array(size);
  return Array.from(buf).map(() => Math.floor(Math.random() * 256));
});

@Injectable()
export class AuthService {
  constructor( 
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(Scholarship) 
    private readonly scholarshipRepository: Repository<Scholarship>,
    
    private readonly jwtService: JwtService,
  ){}

  /**
   * -------------- CREACIÓN Y AUTENTICACIÓN DE USUARIOS --------------
   */

  // Crear usuario
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, password, fullName, scholarship } = createUserDto;

      // Validar formato del email (UPSRJ)
      const matriculaMatch = email.match(/^0(\d{8})@upsrj\.edu\.mx$/);
      //todo - Cambiar el dto 
      if (!matriculaMatch) {
        throw new BadRequestException('Email inválido. Debe ser de la UPSRJ (Ej: 022000949@upsrj.edu.mx)');
      }
      const enrollment = `0${matriculaMatch[1]}`;

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Buscar la beca en base de datos
      const normalizedScholarship = scholarship.toLowerCase().trim();
      const foundScholarship = await this.scholarshipRepository.findOne({
        where: { scholarship_type: normalizedScholarship },
      });
      if (!foundScholarship) {
        throw new NotFoundException(`La beca '${scholarship}' no existe`);
      }

      // Crear usuario
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        fullName,
        enrollment,
        isActive: true,
        isPenalized: false,
        roles: ['user'],
        owed_hours: foundScholarship.hours, 
        scholarship_type: foundScholarship, 
      });

      await this.userRepository.save(user);
      delete user.password;
      return user;

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  // Iniciar sesión
  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    
    const emailLowerCase = email.toLowerCase().trim();
    const user = await this.userRepository.findOne({
      where: { email: emailLowerCase },
      select: ['id', 'email', 'password', 'fullName', 'enrollment', 'isActive', 'isPenalized', 'roles'],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    delete user.password;
    
    return { token: this.getJwtToken({ id: user.id }) };
  }

  // Obtener token JWT
  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  /**
   * -------------- GESTIÓN DE USUARIOS (ADMIN) --------------
   */

  // Penalizar usuario (solo administradores)
  async penalizeUser(enrollment: string, updatePenalizedDto: UpdatePenalizedDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { enrollment } });
      if (!user) throw new NotFoundException(`Usuario con id ${enrollment} no encontrado`);

      user.isPenalized = updatePenalizedDto.isPenalized === 'true';

      if (user.isPenalized) {
        const punishmentScholarship = await this.scholarshipRepository.findOne({ where: { scholarship_type: 'castigo' } });
        if (!punishmentScholarship) throw new NotFoundException(`La beca 'castigo' no existe`);

        user.owed_hours = punishmentScholarship.hours;
        user.scholarship_type = punishmentScholarship;
      }

      if (!user.isPenalized) {
        user.scholarship_type = null;
      }
      
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  // Desactivar usuario (solo administradores)
  async deactivateUser(enrollment: string, desactivateUserDto: DesactivateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { enrollment } });
      if (!user) throw new NotFoundException(`Usuario con id ${enrollment} no encontrado`);

      user.isActive = desactivateUserDto.isActive === 'true';
      if (!user.isActive) {
        user.isPenalized = false;
        user.owed_hours = 0;
        user.scholarship_type = null;
      }
      
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  // Verificar el estado del usuario
  async checkAuthStatus(user: User) {
    return {
      email: user.email,
      fullName: user.fullName,
      enrollment: user.enrollment,
      isPenalized: user.isPenalized,
      scholarship: user.scholarship_type ? user.scholarship_type.scholarship_type : null,
      owed_hours: user.owed_hours,
    };
  }

  // Actualizar datos del usuario (solo administradores)
  //TODO - Implementar actualizacion de usuario
  async updateUser(enrollment: string, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { enrollment } });
      if (!user) throw new NotFoundException(`Usuario con id ${enrollment} no encontrado`);

      return user;
    } 
    catch (error) {
      this.handleDBErrors(error);
    }
  }

  /**
   * -------------- MANEJO DE ERRORES --------------
   */

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.details);
    }
    console.log(error);
    throw new InternalServerErrorException('Error interno en el servidor. Revisa los logs.');
  }
}

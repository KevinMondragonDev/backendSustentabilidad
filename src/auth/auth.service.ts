import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';  
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt.payload.interface';
import { Scholarship } from '../scholarships/entities/scholarship.entity';

bcrypt.setRandomFallback((size: number) => {
  const buf = new Uint8Array(size);
  return Array.from(buf).map(() => Math.floor(Math.random() * 256));
});
@Injectable()
export class AuthService {
  constructor( 
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService:JwtService,
    @InjectRepository(Scholarship) 
    private readonly scholarshipRepository: Repository<Scholarship>
  ){}
  
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, password, fullName, scholarship } = createUserDto;
  
      const matriculaMatch = email.match(/^0(\d{8})@upsrj\.edu\.mx$/);
      if (!matriculaMatch) {
        throw new BadRequestException('Invalid email, it must be a valid UPSRJ email (Example: 022000949@upsrj.edu.mx)');
      }
  
      const enrollment = `0${matriculaMatch[1]}`;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const normalizedScholarship = scholarship.toLowerCase().trim();
      
      const foundScholarship = await this.scholarshipRepository.findOne({
        where: { scholarship_type: normalizedScholarship },
      });
  
      if (!foundScholarship) {
        throw new NotFoundException(`La beca '${scholarship}' no existe`);
      }
      // Crear usuario con la beca seleccionada
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        fullName,
        enrollment,
        isActive: true,
        isPenalized: false,
        roles: ['user'],
        owed_hours: foundScholarship.hours, // Se asignan las horas de la beca
        scholarship_type: foundScholarship, // Se asigna la beca al usuario
      });
  
      await this.userRepository.save(user);
      delete user.password;
      return user;
  
    } catch (error) {
      this.handleDBErrors(error);
    }
  }
  

  async checkAuthStatus(user:User){
    return {
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
      isPenalized: user.isPenalized,
      
      
    };
  }
  async login(loginUserDto: LoginUserDto) {
    const { password, email} = loginUserDto;
    
    const emailLowerCase = email.toLowerCase().trim();
    // Buscar el usuario y seleccionar solo el correo y la contraseña
    const user = await this.userRepository.findOne({
      
        where: { email: emailLowerCase},
        select: { email: true, password: true, id:true, fullName:true, enrollment:true, isActive:true, isPenalized:true, roles:true },
    });
    
    // Verificar si el usuario existe
    if (!user) {
        throw new UnauthorizedException(`Credenciales incorrectas`);
    }
    
    // Comparar la contraseña proporcionada con la almacenada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
        throw new UnauthorizedException(`Credenciales incorrectas`);
    }
    
    // Opcional: eliminar la contraseña del objeto usuario antes de retornarlo
    delete user.password;
    
    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    }; // O puedes devolver un token de autenticación en lugar del usuario.
}

  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.details);
    }

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}

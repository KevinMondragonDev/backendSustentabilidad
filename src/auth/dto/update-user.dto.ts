import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePenalizedDto {
  @ApiProperty({
    example: 'true',
    description: 'It has to be a boolean',
    type: 'boolean',
  })
  @IsString()
  @IsNotEmpty()
  isPenalized: string;
}

export class DesactivateUserDto {
  @ApiProperty({
    example: 'true',
    description: 'It has to be a boolean',
    type: 'boolean',
  })
  @IsString()
  @IsNotEmpty()
  isActive: string;
}

export class UpdateUserDto {
  @ApiProperty({
    example: '022000949@upsrj.edu.mx',
    description: 'Correo del Usuario',
    type: 'string',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description:
      'The password must have a Uppercase, lowercase letter and a number',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'ACADEMIC',
    description: 'Tipo de beca seleccionada por el usuario',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  scholarshipType: string;
}

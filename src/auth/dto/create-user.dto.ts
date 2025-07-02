import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '022000949@upsrj.edu.mx',
    description: 'Correo del Usuario',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^0(\d{8})@upsrj\.edu\.mx$/, {
    message:
      'Email inválido. Debe ser de la UPSRJ (Ej: 022000949@upsrj.edu.mx)',
  })
  email: string;

  @ApiProperty({
    example: 'Abc123',
    description:
      'The password must have a Uppercase, lowercase letter and a number',
    type: 'string',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    example: 'Andrea Lopez',
    description: 'Nombre completo de los usuarios',
    type: 'string',
  })
  @IsString()
  @MinLength(1)
  fullName: string;

  @ApiProperty({
    example: 'ACADEMICA',
    description: 'Tipo de beca seleccionada por el usuario',
  })
  @IsString()
  @IsNotEmpty()
  scholarship: string;
}

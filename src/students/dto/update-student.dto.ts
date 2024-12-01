import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
    @ApiProperty({
        example: '-',
        description: 'Si pertenece al área de inclusión',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    inclusion?: string;

    @ApiProperty({
        example: '14BIS',
        description: 'Año de generación del estudiante',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    generacion?: string;

    @ApiProperty({
        example: 'MASCULINO',
        description: 'Género del estudiante',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    @IsIn(['FEMENINO', 'MASCULINO'])
    genero?: string;

    @ApiProperty({
        example: 'ING. EN ANIMACION Y EFECTOS VISUALES',
        description: 'Carrera del estudiante',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    carrera?: string;

    @ApiProperty({
        example: 10,
        description: 'Cuatrimestre actual del estudiante',
        nullable: true,
    })
    @IsOptional()
    @IsNumber()
    cuatrimestre?: number;

    @ApiProperty({
        example: 'IAEV-29',
        description: 'Grupo al que pertenece el estudiante',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    grupo?: string;

    @ApiProperty({
        example: true,
        description: 'Estatus actual del estudiante (activo/inactivo)',
        nullable: true,
    })
    @IsOptional()
    @IsBoolean()
    estatus?: boolean;
}

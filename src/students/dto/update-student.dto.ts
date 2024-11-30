import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsIn, IsNumber, IsOptional } from 'class-validator';

export class UpdateStudentDto {
    @ApiProperty({
        example: '-',
        description: 'Si pertenece al area de inclusión',
        nullable: true,
    })
    @IsArray()
    @IsOptional()
    Inclusion?: string;

    @ApiProperty({
        example: '14BIS',
        description: 'Año de generación del estudiante',
        nullable: true,
    })
    @IsArray()
    @IsOptional()
    Generacion?: string;


    @ApiProperty({
        example: 'MASCULINO',
        description: 'Género del estudiante',
        nullable: true,
    })
    @IsArray()
    @IsOptional()
    @IsIn(['FEMENINO', 'MASCULINO'])
    Genero?: string;

    @ApiProperty({
        example: 'ING. EN ANIMACION Y EFECTOS VISUALES',
        description: 'Carrera del estudiante',
        nullable: true,
    })
    @IsArray()
    @IsOptional()
    Carrera?: string;

    @ApiProperty({
        example: 10,
        description: 'Cuatrimestre actual del estudiante',
        nullable: true,
    })
    @IsNumber()
    @IsOptional()
    Cuatrimestre?: number;


    @ApiProperty({
        example: 'IAEV-29',
        description: 'Grupo al que pertenece el estudiante',
        nullable: true,
    })
    @IsArray()
    @IsOptional()
    Grupo?: string;

    @ApiProperty({
        example: true,
        description: 'Estatus actual del estudiante (activo/inactivo)',
        nullable: true,
    })
    @IsBoolean()
    @IsOptional()
    Estatus?: boolean;

}

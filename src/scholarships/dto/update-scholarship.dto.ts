import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateScholarshipDto } from './create-scholarship.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateScholarshipDto extends PartialType(CreateScholarshipDto) {
    @ApiProperty({
        example: 'ACADÉMICA',
        description: 'Tipo de beca otorgada al estudiante',
        uniqueItems: true,
    })
    @IsString()
    @IsOptional()
    tipo_beca?: string;
  
    @ApiProperty({
        example: ["50", "60"],
        description: 'rango del porcentaje de la beca (entre 0 y 100)',
    })
    @IsOptional()
    @IsArray()
    @IsString({each:true})
    rango_porcentaje?: string[];

    @ApiProperty({
        example: 'Para alumnos con promedios entre 8.5 y 9.4, ofreciendo una condonación de hasta el 80% de la cuota de reinscripción.',
        description: ' Descripcion del tipo de beca otorgada al estudiante',
    })
    @IsOptional()
    @IsString()
    descripcion?: string;

    
}

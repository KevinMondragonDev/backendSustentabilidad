import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class CreateScholarshipDto {

    @ApiProperty({
        example: 'ACADÉMICA',
        description: 'Tipo de beca otorgada al estudiante',
        uniqueItems: true,
    })
    @IsString()
    tipo_beca: string;
  
    @ApiProperty({
        example: ["50", "60"],
        description: 'rango del porcentaje de la beca (entre 0 y 100)',
    })
    @IsArray()
    @IsString({each:true})
    rango_porcentaje: string[];

    @ApiProperty({
        example: 'Para alumnos con promedios entre 8.5 y 9.4, ofreciendo una condonación de hasta el 80% de la cuota de reinscripción.',
        description: ' Descripcion del tipo de beca otorgada al estudiante',
    })
    @IsString()
    descripcion: string;

    
}

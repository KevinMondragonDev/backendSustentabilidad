import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsString, Min } from "class-validator";

export class CreateScholarshipDto {

    
    @ApiProperty({
        example: 'ACADÉMICA',
        description: 'Tipo de beca otorgada al estudiante',
        uniqueItems: true,
    })

    @IsString()
    scholarship_type: string;
  
    @ApiProperty({
        example: ["50", "60"],
        description: 'rango del porcentaje de la beca (entre 0 y 100)',
    })
    @IsArray()
    @IsString({each:true})
    percentage_max_range: string[];

    @ApiProperty({
        example: 'Para alumnos con promedios entre 8.5 y 9.4, ofreciendo una condonación de hasta el 80% de la cuota de reinscripción.',
        description: ' Descripcion del tipo de beca otorgada al estudiante',
    })
    @IsString()
    description: string;

    @ApiProperty({
        example: 20,
        description: 'Número de horas que se deben cumplir para la beca',
    })
    @IsInt()
    @Min(0)
    hours: number;
    


}

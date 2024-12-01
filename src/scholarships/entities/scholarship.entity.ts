import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Scholarship' })
export class Scholarship {

    @ApiProperty({
        example: '1c18fb2d-9760-467c-bf0c-d2aacb0f8008',
        description: 'UUID interno de la beca , no lo ve el usuario',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'ACADÉMICA',
        description: 'Tipo de beca otorgada al estudiante',
        uniqueItems: true,
    })
    @PrimaryColumn('text', {
        unique: true,
    })
    tipo_beca: string;

    @ApiProperty({
        example: 'Para alumnos con promedios entre 8.5 y 9.4, ofreciendo una condonación de hasta el 80% de la cuota de reinscripción.',
        description: ' Descripcion del tipo de beca otorgada al estudiante',
    })
    @Column()
    descripcion: string;

    @BeforeInsert()
    checkSlugUpdate() {
        this.tipo_beca = this.normalizeString(this.tipo_beca);
        this.descripcion = this.normalizeString(this.descripcion);
    }

    private normalizeString(input: string): string {
        return input
            .toUpperCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
}
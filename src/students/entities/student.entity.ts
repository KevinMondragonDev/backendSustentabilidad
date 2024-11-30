import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';


@Entity({ name: 'students' })
export class Student {

    @ApiProperty({
        example: '019001244',
        description: 'Matricula única del estudiante',
        uniqueItems: true
    })
    @PrimaryColumn('text', {
        unique: true,
    })
    Matricula: string;

    @ApiProperty({
        example: 'GONZALEZ GARCIA JOSUE',
        description: 'Nombre completo del estudiante',
    })
    @Column()
    NombreCompleto: string;

    @ApiProperty({
        example: '-',
        description: 'Si pertenece al area de inclusión',
        nullable: true,
    })
    @Column('text', {
        nullable: true,
    })
    Inclusion: string;

    @ApiProperty({
        example: '14BIS',
        description: 'Año de generación del estudiante',
        nullable: true,
    })
    @Column('text', {
        nullable: true,
    })
    Generacion: string;

    @ApiProperty({
        example: 'MASCULINO',
        description: 'Género del estudiante',
        nullable: true,
    })
    @Column('text', {
        nullable: true,
    })
    Genero: string;

    @ApiProperty({
        example: 'ING. EN ANIMACION Y EFECTOS VISUALES',
        description: 'Carrera del estudiante',
        nullable: true,
    })
    @Column('text', {
        nullable: true,
    })
    Carrera: string;

    @ApiProperty({
        example: 10,
        description: 'Cuatrimestre actual del estudiante',
        nullable: true,
    })
    @Column('int', {
        nullable: true,
    })
    Cuatrimestre: number;

    @ApiProperty({
        example: 'IAEV-29',
        description: 'Grupo al que pertenece el estudiante',
        nullable: true,
    })
    @Column('text', {
        nullable: true,
    })
    Grupo: string;
    
    @ApiProperty({
        example: true,
        description: 'Estatus actual del estudiante (activo/inactivo)',
        nullable: true,
    })
    @Column('boolean', {
        nullable: true,
    })
    Estatus: boolean;

    @BeforeInsert()
    checkSlugUpdate() {
        this.NombreCompleto = this.normalizeString(this.NombreCompleto);
        this.Generacion = this.normalizeString(this.Generacion);
        this.Genero = this.normalizeString(this.Genero);
        this.Carrera = this.normalizeString(this.Carrera);
    }

    private normalizeString(input: string): string {
        return input
            .toUpperCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
}

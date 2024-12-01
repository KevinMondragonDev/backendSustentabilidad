import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'students' })
export class Student {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ApiProperty({
        example: '019001244',
        description: 'Matricula única del estudiante',
        uniqueItems: true
    })
    @PrimaryColumn('text', {
        unique: true,
    })
    matricula: string;

    @ApiProperty({
        example: 'GONZALEZ GARCIA JOSUE',
        description: 'Nombre completo del estudiante',
    })
    @Column()
    nombreCompleto: string;

    @ApiProperty({
        example: '-',
        description: 'Si pertenece al area de inclusión',
        nullable: true,
    })
    @Column('text', {
        nullable: true,
    })
    inclusion: string;

    @ApiProperty({
        example: '14BIS',
        description: 'Año de generación del estudiante',
        nullable: true,
    })
    @Column('text', {
        nullable: true,
    })
    generacion: string;

    @ApiProperty({
        example: 'MASCULINO',
        description: 'Género del estudiante',
        nullable: true,
    })
    @Column('text', {
        nullable: true,
    })
    genero: string;

    @ApiProperty({
        example: 'ING. EN ANIMACION Y EFECTOS VISUALES',
        description: 'Carrera del estudiante',
        nullable: true,
    })
    @Column('text', {
        nullable: true,
    })
    carrera: string;

    @ApiProperty({
        example: 10,
        description: 'Cuatrimestre actual del estudiante',
        nullable: true,
    })
    @Column('int', {
        nullable: true,
    })
    cuatrimestre: number;

    @ApiProperty({
        example: 'IAEV-29',
        description: 'Grupo al que pertenece el estudiante',
        nullable: true,
    })
    @Column('text', {
        nullable: true,
    })
    grupo: string;
    
    @ApiProperty({
        example: true,
        description: 'Estatus actual del estudiante (activo/inactivo)',
        nullable: true,
    })
    @Column('boolean', {
        nullable: true,
    })
    estatus: boolean;

    @BeforeInsert()
    checkSlugUpdate() {
        this.nombreCompleto = this.normalizeString(this.nombreCompleto);
        this.generacion = this.normalizeString(this.generacion);
        this.genero = this.normalizeString(this.genero);
        this.carrera = this.normalizeString(this.carrera);
    }

    private normalizeString(input: string): string {
        return input
            .toUpperCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
}

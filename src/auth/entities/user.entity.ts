import { ApiProperty } from '@nestjs/swagger';
import { HoursService } from 'src/hours_service/entities/hours_service.entity';
import { Scholarship } from 'src/scholarships/entities/scholarship.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({name:"users"})
export class User {

    @ApiProperty({
        description: 'Identificador único del usuario',
        type: String,
    })
    @PrimaryGeneratedColumn('uuid')
    id:string;

    //* Mail de los usuarios
    @ApiProperty({
        description: 'Correo del usuario',
        type: String,
    })
    @Column('text', {
        unique:true
    })
    email:string;

    //* Password
    @ApiProperty({
        description: 'Contraseña de los usuarios',
        type: String,
    })
    @Column('text', {
        select:false
    })
    password:string;    

    
    //* FullName
    @ApiProperty({
        description: 'Matricula de los usuarios',
        type: String,
    })
    @Column('text')
    enrollment:string;

    //* FullName
    @ApiProperty({
        description: 'Nombre completo de los usuarios',
        type: String,
    })
    @Column('text')
    fullName:string;

    //* IsActive
    @ApiProperty({
        description: 'Los usuarios no se elimina, solo se dan de baja con un boolean',
        type: Boolean,
    })
    @Column('bool' , {
        default:true
    })
    isActive:boolean;

    //* Ispenalized
    @ApiProperty({
        description: 'Los usuarios cuando son penalizados,se ponen como true',
        type: Boolean,
    })
    @Column('bool' , {
        default:false
    })
    isPenalized:boolean;

    //* Roles de los usuarios
    @ApiProperty({
        description: 'Los diferentes tipos usuarios de la app: admin, voluntarios , user, pero se define user por defecto',
        type: [String],
    
    })
    @Column('text' , {
        array:true,
        default:['user']
    })
    roles:string[];

    @ApiProperty({ description: 'Horas adeudadas por el usuario', type: Number })
    @Column('decimal', { 
        precision: 10, 
        scale: 2, 
        default: 0 })
    owed_hours: number;

    @BeforeInsert()
    checkFieldsInsert() {
        this.email = this.email
            .toLowerCase()
            .trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {

        this.email = this.email
            .toLowerCase()
            .trim();
    }
    @ManyToOne(() => Scholarship, (scholarship) => scholarship.users, {
        eager: true, // Cargar automáticamente la beca con el usuario
    })
    scholarship_type: Scholarship;
    
    @OneToMany(
        () => HoursService,
        (hoursService) => hoursService.user,
        { cascade: true , eager: true }
    )
    hoursService: HoursService[];

}   

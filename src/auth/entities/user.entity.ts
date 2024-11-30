import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

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
    mail:string;

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

    //* Roles de los usuarios
    @ApiProperty({
        description: 'Los diferentes tipos usuarios de la app: admin, super-user, user, pero se define user por defecto',
        type: [String],
    
    })
    @Column('text' , {
        array:true,
        default:['user']
    })
    roles:string[];

    @BeforeInsert()
    checkFieldsInsert() {

        this.mail = this.mail
            .toLowerCase()
            .trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {

        this.mail = this.mail
            .toLowerCase()
            .trim();
    }

}   

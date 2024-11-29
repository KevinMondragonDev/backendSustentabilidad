import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({name:"users"})
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text', {
        unique:true
    })
    mail:string;

    @Column('text', {
        select:false
    })
    password:string;

    @Column('text')
    fullName:string;

    @Column('bool' , {
        default:true
    })
    isActive:boolean;
    
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

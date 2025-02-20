import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'scholarship' })
export class ScholarShip {
    @ApiProperty({
    description: 'Identificador único del registro',
    type: String,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
    description: 'Total de las horas que tienen que cumplir los becarios',
    type: Number,
    })
    @Column('int', { default: 0 })
    hours : number;
    
    @ApiProperty({
    description: 'Fecha de la ultima actualizacion dada por el departamento de sustentabilidad',
    type: Date,
    })
  //Use 'timestamp', 'timestamptz', or 'datetime' depending on your DB and needs
    @Column('timestamp', { nullable: true })
    last_update: Date;

    @OneToMany(() => User, (user) => user.hoursService)
    user: User;
}

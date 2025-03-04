import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'hoursService' })
export class HoursService {
  @ApiProperty({
    description: 'Identificador único del registro',
    type: String,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Fecha/hora de inicio como Date (para registrar timestamps)',
    type: Date,
  })
  // Use 'timestamp', 'timestamptz', or 'datetime' depending on your DB and needs
  @Column('timestamp', { nullable: true })
  start_date: Date;

  @ApiProperty({
    description: 'Fecha/hora de fin como Date (para registrar timestamps), cuando termina la jornada',
    type: Date,
  })
  // Use 'timestamp', 'timestamptz', or 'datetime' depending on your DB and needs
  @Column('timestamp', { nullable: true })
  end_date: Date;

  @ApiProperty({
    description: 'Revisa si se completó la jornada, con registro de inicio y fin',
    type: Boolean,
  })
  @Column('bool', { default: false })
  isComplete: boolean;

  @ApiProperty({
    description: 'Total de las horas realizadas',
    type: Number,
  })
  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  total_hours: number;


  @ManyToOne(() => User, (user) => user.hoursService)
  user: User;
}

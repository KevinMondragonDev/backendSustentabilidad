import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'scholarship' })
export class Scholarship {

  @ApiProperty({
    example: '1c18fb2d-9760-467c-bf0c-d2aacb0f8008',
    description: 'Internal scholarship UUID, not visible to the user',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'ACADEMIC',
    description: 'Type of scholarship a≠≠warded to the student',
  })
  @Column('text', {
    unique: true,
  })
  scholarship_type: string;

  @ApiProperty({
    example: '50',
    description: 'Range of the scholarship percentage (between 0 and 100)',
  })
  @Column('simple-array', {
    default: '60',
  })
  percentage_max_range: string;

  @ApiProperty({
    example: 'For students with averages between 8.5 and 9.4, offering up to 80% remission of the re-enrollment fee.',
    description: 'Description of the type of scholarship awarded to the student',
  })
  @Column()
  description: string;

  @ApiProperty({
    example: '20',
    description: 'how many hours the scholarship needs',
  })
  @Column('int', { default: 0 })
  hours: number;

  @OneToMany(() => User, (user) => user.scholarship_type)
  users: User[];


  @BeforeInsert()
  checkSlugUpdate() {
    this.scholarship_type = this.normalizeString(this.scholarship_type);
  }

  private normalizeString(input: string): string {
    return input
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}

import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  imports:[
    TypeOrmModule.forFeature([Student]),
    AuthModule
  ]
})
export class StudentsModule {}

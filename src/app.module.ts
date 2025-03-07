import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScholarshipsModule } from './scholarships/scholarships.module';
import { HoursServiceModule } from './hours_service/hours_service.module';
import { User } from './auth/entities/user.entity';
import { HoursService } from './hours_service/entities/hours_service.entity';
import { SeedModule } from './seed/seed.module';


@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [User, HoursService],      
      autoLoadEntities: true,
      synchronize: true,
    }),
    
    CommonModule,
    AuthModule,
    ScholarshipsModule,
    HoursServiceModule,
    SeedModule],
  controllers: [],
  providers: [],

})
export class AppModule {}

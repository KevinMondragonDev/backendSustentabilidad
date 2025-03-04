import { Module } from '@nestjs/common';
import { HoursServiceService } from './hours_service.service';
import { HoursServiceController } from './hours_service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HoursService } from './entities/hours_service.entity';
import { User } from 'src/auth/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  controllers: [HoursServiceController],
  imports:[
    ConfigModule, 
    TypeOrmModule.forFeature([HoursService, User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '5m' },
      }),
    }),
  ],

  providers: [HoursServiceService, JwtStrategy],
  exports: [HoursServiceService, JwtStrategy, PassportModule, JwtModule],
})
export class HoursServiceModule {}

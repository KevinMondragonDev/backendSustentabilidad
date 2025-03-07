import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ScholarshipsModule } from '../scholarships/scholarships.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ScholarshipsModule,
    AuthModule
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
import { Module } from '@nestjs/common';
import { HoursServiceService } from './hours_service.service';
import { HoursServiceController } from './hours_service.controller';

@Module({
  controllers: [HoursServiceController],
  providers: [HoursServiceService],
})
export class HoursServiceModule {}

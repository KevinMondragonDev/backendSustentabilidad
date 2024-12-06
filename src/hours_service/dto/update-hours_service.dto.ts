import { PartialType } from '@nestjs/swagger';
import { CreateHoursServiceDto } from './create-hours_service.dto';

export class UpdateHoursServiceDto extends PartialType(CreateHoursServiceDto) {}

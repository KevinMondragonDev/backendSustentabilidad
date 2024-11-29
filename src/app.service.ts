import { Injectable } from '@nestjs/common';
import { Auth } from './auth/decorators';
import { ValidRoles } from './auth/interfaces';

@Injectable()
export class AppService {
  @Auth(ValidRoles.admin)
  getHello(): string {
    return 'Hello World!';
  }
}

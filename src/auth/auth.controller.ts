import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { get, request } from 'http';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UpdatePenalizedDto } from './dto';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { Auth } from './decorators/auth.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { ValidRoles } from './interfaces';
import { DesactivateUserDto, UpdateUserDto } from './dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'User was created successfully',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request due to invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related issues' })
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiResponse({
    status: 201,
    description: 'User logged in',
    type: LoginUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request due to invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related issues' })
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiResponse({ status: 201, description: 'User check-status', type: User })
  @ApiResponse({ status: 400, description: 'Bad request due to invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related issues' })
  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @ApiResponse({
    status: 201,
    description: 'User has been updated',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request due to invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related issues' })
  @Patch('penalize/:enrollment')
  @Auth(ValidRoles.admin)
  penalizeUser(
    @Param('enrollment') enrollment: string,
    @Body() updatePenalizedDto: UpdatePenalizedDto,
  ) {
    return this.authService.penalizeUser(enrollment, updatePenalizedDto);
  }

  @ApiResponse({
    status: 201,
    description: 'User has been updated',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request due to invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related issues' })
  @Patch('desactivate/:enrollment')
  @Auth(ValidRoles.admin)
  deactivateUser(
    @Param('enrollment') enrollment: string,
    @Body() desactivateUserDto: DesactivateUserDto,
  ) {
    return this.authService.desactivateUser(enrollment, desactivateUserDto);
  }
  @ApiResponse({
    status: 201,
    description: 'User has been updated',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request due to invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related issues' })
  @Patch('update/:enrollment')
  @Auth(ValidRoles.admin)
  updateUser(
    @Param('enrollment') enrollment: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.updateUser(enrollment, updateUserDto);
  }
}

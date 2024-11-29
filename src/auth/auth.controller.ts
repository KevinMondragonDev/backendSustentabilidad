import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { get, request } from 'http';
import { RawHeaders } from './decorators/get-rawHeaders.decorator';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators/auth.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto:CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post('login')
  loginUser(@Body() loginUserDto:LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user)
  }

  @Get('private')
  @UseGuards(AuthGuard()) 
  testingPrivateRoute(
    @Req() request:Express.Request,
    @GetUser() user:User,
    @GetUser('mail') userMail:string,

    @RawHeaders() rawHeaders:string[]
  ){


    return {
      ok:true,
      message:"Hola mundo privado",
      user,
      userMail,
      rawHeaders
    }
  }

  //* @SetMetadata('roles', ['admin','super-user'])

  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard() , UserRoleGuard)
  //Cuando es un Guard personalizado no se pone "()"
  privateRoute2(
    @GetUser() user:User,
  ){
    console.log(request)

    return {
      ok:true,
      message:"Hola mundo privado",
      user
    }
  }

  @Get('private3')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  privateRoute3(
    @GetUser() user:User,
  ){
    console.log(request)

    return {
      ok:true,
      message:"Hola mundo privado",
      user
    }
  }

}

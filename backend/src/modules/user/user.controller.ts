import {
  Controller, Get,
  InternalServerErrorException,
  Delete, Post,
  Body, UseGuards,
  Patch,
  Param,
  NotFoundException,
  Put,
  Render,
  Res,
  Redirect,
  Req,
  NotAcceptableException,
  UnauthorizedException,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query
} from '@nestjs/common';
import { UsersService } from './user.service';
import { SigninDto } from './dto/signin-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { IRequest } from './user.interface';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { headers } from '@modules/common/constants';


@UseInterceptors(ClassSerializerInterceptor)
// @UseGuards(AuthGuard)
@Controller('/auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  @Post('/register')
  async register(@Body() body: CreateUserDto) {
    try {
      const newUser = await this.usersService.create(body);
      return newUser;
    } catch (error) {
      console.error('Error occurred during registration:', error.message);
      return { error: error.message };
    }
  }

  @Post('/login')
  async connect(@Body() body: SigninDto, @Res({ passthrough: true }) response: Response) {
    try {
      const user = await this.usersService.validateUser(body);

      const jwt = await this.jwtService.signAsync({
        id: user.userId,
      });

      response.cookie('jwt', jwt, {
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks
      });

      return user;

    } catch (error) {
      console.log(error);

      return {
        error: error.message
      }
    }
  }


  @UseGuards(AuthGuard)
  @Get('/user')
  async user(@Req() request: Request) {
    try {
      // const accessToken = request.headers.authorization.replace('Bearer ', '');
      // const { id } = await this.jwtService.verifyAsync(accessToken);
      const cookie = request.cookies['jwt'];
      const { id } = await this.jwtService.verifyAsync(cookie);

      const user = this.usersService.get(id);
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: "logged out"
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.usersService.get(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateUser(@Req() request: Request, @Param('id') id: number, @Body() body: UpdateUserDto) {
    const decodedToken = this.jwtService.decode(request.cookies['jwt']);
    console.log('Decoded Token: ', decodedToken);  // Log the decoded token
    const userId = decodedToken?.id;
    console.log('user Id from Token: ', userId); // Ensure this logs the correct user ID

    if (!userId) {
      throw new UnauthorizedException('User ID could not be extracted from the token');
    }
    await this.usersService.updateUser(userId, id, body);
    return this.usersService.get(id);
  }

  @UseGuards(AuthGuard)
  @Get()
  async all(@Query('page') page: number): Promise<UserEntity[]> {
    return this.usersService.paginate(page);
  }

}
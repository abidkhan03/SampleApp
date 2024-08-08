import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Controller, Get, HttpStatus, Param, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from '../user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) { }

  @Get('/')
  async index() {
    const hello = this.appService.getHello();
    return {
      body: hello
    }
  }

  @Get('config')
  getConfig() {
    return {
      jwt_expiration_time: this.configService.get('JWT_EXPIRATION_TIME'),
    };
  }
}


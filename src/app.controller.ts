import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/passport/local-auth.guard';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { Public } from './decorator/customize';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private configService: ConfigService,
    private authService: AuthService
  ) {

  }


}

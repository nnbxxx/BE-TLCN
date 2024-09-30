import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ms from 'ms';
import { JwtStrategy } from './passport/jwt.strategy';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './passport/local.strategy';
import { UsersModule } from 'src/modules/users/users.module';
import { CartsModule } from 'src/modules/carts/carts.module';

@Module({
  imports: [PassportModule, UsersModule, CartsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: ms(configService.get<string>('JWT_ACCESS_EXPIRE')),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],

})
export class AuthModule { }

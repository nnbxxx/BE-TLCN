import { Controller, Post, UseGuards, Req, Get, Body, Res, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';


import { LocalAuthGuard } from './passport/local-auth.guard';
import { Request, Response } from 'express';

import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto, UserLoginDto } from 'src/modules/users/dto/create-user.dto';
import { IUser } from 'src/modules/users/users.interface';

import { ChangePasswordAuthDto, CodeAuthDto } from './dto/create-auth.dto';
import { UsersService } from '../modules/users/users.service';
import { ForgotPassUserDto } from './dto/update-auth.dto';
import { EmailSW, ProfileUserDto, ProfileUserDtoSw } from 'src/modules/users/dto/update-user.dto';

@ApiTags('auth')
@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService

    ) { }
    @Public()
    @ApiBody({ type: UserLoginDto, })
    @UseGuards(LocalAuthGuard)
    @ResponseMessage("User Login")
    @Post('/login')
    handleLogin(
        @Req() req,
        @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }
    @Public()
    @ResponseMessage("Register a new user")
    @Post('/register')
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }
    @ResponseMessage("Get user information")
    @Get('/account')
    handleGetAccount(@User() user: IUser) {
        return { user };
    }
    @Public()
    @ResponseMessage("Get User handleRefreshToken")
    @Get('/refresh')
    handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies["refresh_token"];
        return this.authService.processNewToken(refreshToken, response);
    }
    @ResponseMessage("Logout User")
    @Post('/logout')
    handleLogout(
        @Res({ passthrough: true }) response: Response,
        @User() user: IUser
    ) {
        return this.authService.logout(response, user);
    }
    @Public()
    @Patch('/change-password') // ""
    @ResponseMessage('Change Password User')
    async handleChangePassword(
        @Body() userDto: ChangePasswordAuthDto,
    ) {
        return this.authService.changePassword(userDto);
    }
    @Patch('/update-profile') // ""
    @ApiBody({ type: ProfileUserDtoSw })
    @ResponseMessage('Update profile User')
    async handleUpdateProfile(
        @Body() userDto: ProfileUserDto,
        @User() user: IUser,
    ) {
        return this.userService.updateProfile(userDto, user);
    }

    @Post('check-code')
    @Public()
    checkCode(@Body() registerDto: CodeAuthDto) {
        return this.authService.checkCode(registerDto);
    }

    @Post('retry-active')
    @Public()
    @ApiBody({ type: EmailSW })
    retryActive(@Body("email") email: string) {
        return this.authService.retryActive(email);
    }

    @Post('retry-password')
    @ApiBody({ type: EmailSW })
    @Public()
    retryPassword(@Body("email") email: string) {
        return this.authService.retryPassword(email);
    }

}

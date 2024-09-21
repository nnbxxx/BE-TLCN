import { Controller, Post, UseGuards, Req, Get, Body, Res, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';


import { LocalAuthGuard } from './passport/local-auth.guard';
import { Request, Response } from 'express';

import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto, UserLoginDto } from 'src/modules/users/dto/create-user.dto';
import { IUser } from 'src/modules/users/users.interface';

import { ChangePasswordAuthDto } from './dto/create-auth.dto';
import { UsersService } from '../modules/users/users.service';
import { ForgotPassUserDto } from './dto/update-auth.dto';

@ApiTags('auth')
@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService

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
    @ResponseMessage("Get User by refresh token")
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
    @Patch('/change-password') // ""
    @ResponseMessage('Change Password User')
    async handleChangePassword(
        @Body() userDto: ChangePasswordAuthDto,
        @User() user: IUser,
    ) {
        const changePassUser = await this.authService.changePassword(userDto)
        return changePassUser;

    }
    @Patch('/update-profile') // ""
    @ResponseMessage('Update profile User')
    async handleUpdateProfile(
        // @Body() userDto: ProfileUserDto,
        // @User() user: IUser,
    ) {
        //return this.usersService.updateProfile(userDto, user);
        //return { x: "Chưa làm" };
    }
    @Public()
    @Post('/forgot-password')
    @ResponseMessage('Forgot password of user')
    async handleForgotPassword(
        @Body() userDto: ForgotPassUserDto
    ) {
        const forgotPassUser = await this.authService.retryPassword(userDto.email);
        return forgotPassUser;

    }
    @Public()
    @Post('/active-account')
    @ResponseMessage('Forgot password of user')
    async handleActiveAccount(
        // @Body() userDto: ForgotPassUserDto
    ) {
        //   const forgotPassUser = await this.authService.forgotPassword(userDto);
        //   return forgotPassUser;
        return { x: "Chưa làm" };
    }

}

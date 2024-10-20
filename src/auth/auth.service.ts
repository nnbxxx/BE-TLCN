import { BadRequestException, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
import { ChangePasswordAuthDto, CodeAuthDto } from './dto/create-auth.dto';
import { UsersService } from 'src/modules/users/users.service';
import { IUser } from 'src/modules/users/users.interface';
import { RegisterUserDto } from 'src/modules/users/dto/create-user.dto';
import { CartsService } from 'src/modules/carts/carts.service';
import { LikeProductsService } from 'src/modules/like-products/like-products.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private cartService: CartsService,
        private likeProductService: LikeProductsService
    ) { }

    //ussername/ pass là 2 tham số thư viện passport nó ném về
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password);
            if (isValid === true) {
                return user;
            }
        }

        return null;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role, age, gender, address } = user;

        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            age, gender, address,
            role,
        };

        const refresh_token = this.createRefreshToken(payload);

        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id);

        //set refresh_token as cookies
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
        })

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role, age, gender, address
            }
        };

    }

    async register(user: RegisterUserDto) {
        let newUser = await this.usersService.register(user);
        await this.cartService.create(newUser as any)
        await this.likeProductService.create(newUser as any)
        return {
            _id: newUser?._id,
            createdAt: newUser?.createdAt
        };
    }
    handleActive = async (data: CodeAuthDto) => {
        return await this.usersService.handleActive(data);
    }

    checkCode = async (data: CodeAuthDto) => {
        return await this.usersService.handleActive(data);
    }
    retryActive = async (data: string) => {
        return await this.usersService.retryActive(data);
    }
    retryPassword = async (email: string) => {
        return await this.usersService.retryPassword(email);
    }
    changePassword = async (data: ChangePasswordAuthDto) => {
        return await this.usersService.changePassword(data);
    }
    createRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")) / 1000
        });
        return refresh_token;
    }
    // get new refresh_token
    processNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            })
            let user = await this.usersService.findUserByToken(refreshToken);
            if (user) {
                const { _id, name, email, role, age, gender, address } = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role, age, gender, address
                };

                const refresh_token = this.createRefreshToken(payload);

                //update user with refresh token
                await this.usersService.updateUserToken(refresh_token, _id.toString());

                //set refresh_token as cookies
                response.clearCookie("refresh_token");

                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
                })

                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        role, age, gender, address
                    }
                };
            } else {
                throw new BadRequestException(`Refresh token không hợp lệ. Vui lòng login.`)
            }
        } catch (error) {
            throw new BadRequestException(`Refresh token không hợp lệ. Vui lòng login.`)
        }
    }
    logout = async (response: Response, user: IUser) => {
        await this.usersService.updateUserToken("", user._id);
        response.clearCookie("refresh_token");
        return "ok";
    }


}

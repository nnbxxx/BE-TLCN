import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/modules/users/users.module';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ms from 'ms';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/users/schemas/user.schema';
import { Role, RoleSchema } from 'src/modules/roles/schemas/role.schemas';

@Module({
    imports: [
        UsersModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Role.name, schema: RoleSchema },
        ]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
                signOptions: {
                    expiresIn: ms(
                        configService.get<string>('JWT_ACCESS_EXPIRE'),
                    ),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [AppGateway, UsersService],
    controllers: [],
    exports: [AppGateway],
})
export class GatewayModule {}

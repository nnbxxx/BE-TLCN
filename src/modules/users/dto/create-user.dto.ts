import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEmail,
    IsMongoId,
    IsNotEmpty,
    IsNotEmptyObject,
    IsObject,
    IsString,
    ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';
export class CreateUserDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    // @IsEmail({}, { message: 'Email phải đúng định dạng' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @IsNotEmpty({ message: 'Password không được để trống' })
    password: string;

    @IsNotEmpty({ message: 'Age không được để trống' })
    age: number;

    @IsNotEmpty({ message: 'Gender không được để trống' })
    gender: string;

    @IsNotEmpty({ message: 'Address không được để trống' })
    address: string;

    @IsNotEmpty({ message: 'role không được để trống' })
    // @IsMongoId({ message: 'role có định dạng là mongo object id' })
    // role: mongoose.Schema.Types.ObjectId;
    role: string;
    // @IsObject()
    // @ValidateNested()
    // @Type(() => Company)
    // company: Company;
}
export class RegisterUserDto {

    @IsNotEmpty({ message: 'Name không được để trống', })
    name: string;

    @IsEmail({}, { message: 'Email không đúng định dạng', })
    @IsNotEmpty({ message: 'Email không được để trống', })
    email: string;

    @IsNotEmpty({ message: 'Password không được để trống', })
    password: string;

    @IsNotEmpty({ message: 'Age không được để trống', })
    age: number;

    @IsNotEmpty({ message: 'Gender không được để trống', })
    gender: string;

    @IsNotEmpty({ message: 'Address không được để trống', })
    address: string;
}
export class UserLoginDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'uyenbao4a5@gmail.com', description: 'username' })
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '123456',
        description: 'password',
    })
    readonly password: string;

}
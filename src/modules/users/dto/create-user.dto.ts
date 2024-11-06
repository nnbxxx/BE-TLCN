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
    @IsMongoId({ message: 'Role có định dạng là mongo id', })
    role: mongoose.Schema.Types.ObjectId;

}
export class RegisterUserDto {
    @ApiProperty({ example: 'ngô nguyên bảo', description: 'name' })
    @IsNotEmpty({ message: 'Name không được để trống', })
    name: string;

    @ApiProperty({ example: 'uyenbao4a5@gmail.com', description: 'email' })
    @IsEmail({}, { message: 'Email không đúng định dạng', })
    @IsNotEmpty({ message: 'Email không được để trống', })
    email: string;

    @ApiProperty({ example: '123456', description: 'password' })
    @IsNotEmpty({ message: 'Password không được để trống', })
    password: string;

    // @ApiProperty({ example: 21, description: 'age' })
    // @IsNotEmpty({ message: 'Age không được để trống', })
    // age: number;

    // @ApiProperty({ example: 'female', description: 'gender' })
    // @IsNotEmpty({ message: 'Gender không được để trống', })
    // gender: string;

    // @ApiProperty({ example: '1 vvn hcm tp', description: 'address' })
    // @IsNotEmpty({ message: 'Address không được để trống', })
    // address: string;
}
export class UserLoginDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'admin@gmail.com', description: 'username' })
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '123456',
        description: 'password',
    })
    readonly password: string;

}
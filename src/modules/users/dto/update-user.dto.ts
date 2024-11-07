import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TYPE_GENDER } from 'src/constants/schema.enum';
export class UpdateUserDto extends OmitType(CreateUserDto, [
    'password'
] as const) {
    @IsNotEmpty({ message: '_id không được để trống' })
    _id: string;
}
export class ProfileUserDto extends OmitType(CreateUserDto, [
    'email',
    'password',
    'role',
] as const) { }

export class ProfileUserDtoSw {
    @ApiProperty({ example: 'abc XYZ', description: 'Username' })
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;
    @ApiProperty({ example: '21', description: 'Age' })
    @IsNotEmpty({ message: 'Age không được để trống' })
    age: number;
    @ApiProperty({ example: 'Female', description: 'Gender' })
    @IsNotEmpty({ message: 'Gender không được để trống' })
    gender: string;
    @ApiProperty({ example: '1vvn', description: 'Address' })
    @IsNotEmpty({ message: 'Address không được để trống' })
    address: string;

}
export class ProfileUserDtoSwWeb {
    @ApiProperty({ example: 'abc XYZ', description: 'Username' })
    @IsString({ message: 'Name phải là string' })
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @ApiProperty({ example: '21', description: 'Age' })
    @IsNotEmpty({ message: 'Age không được để trống' })
    age: number;
    @ApiProperty({ example: TYPE_GENDER.MALE, description: 'Gender' })
    @IsNotEmpty({ message: 'Gender không được để trống' })
    @IsEnum(TYPE_GENDER, { message: 'paymentMethod phải là enum ' })
    gender: string;
    // @ApiProperty({ example: '1vvn', description: 'Address' })
    // @IsNotEmpty({ message: 'Address không được để trống' })
    // address: string;

    @ApiProperty({ example: 'avt.com.vn', description: 'avatar' })
    @IsString({ message: 'avatar phải là string' })
    @IsOptional()
    // @IsNotEmpty({ message: 'avatar không được để trống' })
    avatar: string;

}
export class UpdateProfileUser {
    @ApiProperty({ example: 'abc XYZ', description: 'Username' })
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;
    @ApiProperty({ example: 'Female', description: 'Gender' })
    @IsNotEmpty({ message: 'Gender không được để trống' })
    gender: string;
}
export class EmailSW {
    @ApiProperty({ example: 'uyenbao4a5@gmail.com', description: 'Email' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;
}

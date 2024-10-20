import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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

export class EmailSW {
    @ApiProperty({ example: 'uyenbao4a5@gmail.com', description: 'Email' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;
}

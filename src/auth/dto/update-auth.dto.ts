import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';
export class UpdateAuthDto extends PartialType(CreateAuthDto) { }

export class ForgotPassUserDto {
    @IsEmail({}, { message: 'Email phải đúng định dạng' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;
}
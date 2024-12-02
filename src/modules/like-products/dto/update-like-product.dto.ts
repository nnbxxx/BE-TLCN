import { PartialType } from '@nestjs/mapped-types';
import { CreateLikeProductDto } from './create-like-product.dto';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLikeProductDto extends PartialType(CreateLikeProductDto) { }


export class AddLikeProductDto {
    @IsNotEmpty({ message: 'product không được để trống' })
    _id: string;
}
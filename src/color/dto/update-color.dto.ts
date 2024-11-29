import { PartialType } from '@nestjs/mapped-types';
import { CreateColorDto } from './create-color.dto';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UpdateColorDto
// extends PartialType(CreateColorDto) 
{
    @IsMongoId({ message: '_id phải có dạng là mongo id' })
    @IsNotEmpty({ message: '_id không được để trống' })
    _id: string;
    @IsString({ message: "Màu phải là chuỗi" })
    @IsNotEmpty({ message: 'Ảnh không được để trống' })
    color: string;

}

import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBrandDto
// extends PartialType(CreateBrandDto)
{
    @IsMongoId({ message: '_id phải có dạng là mongo id' })
    @IsNotEmpty({ message: '_id không được để trống' })
    _id: string;
    @IsString({ message: "tên phải là chuỗi" })
    @IsNotEmpty({ message: 'tên không được để trống' })
    brand: string;
}

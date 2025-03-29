import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import mongoose from "mongoose";
export class UpdateProductDto
{
    @IsMongoId({ message: '_id có dạng mongodb id' })
    @IsNotEmpty({ message: '_id không được để trống' })
    _id: string;

    @ApiProperty({ example: 'dior 0001', description: 'Tên product' })
    @IsNotEmpty({ message: 'Tên sản phẩm không được để trống', })
    name: string;

    @ApiProperty({ example: 'aaaaaaaaaa', description: 'mã category' })
    @IsNotEmpty({ message: 'Category sản phẩm không được để trống', })
    category: string;

    @ApiProperty({ example: 'dior', description: 'tên thương hiệu' })
    @IsNotEmpty({ message: 'Brand không được để trống', })
    brand: string;

    @ApiProperty({ example: 'featured', description: 'tên thương hiệu' })
    @IsNotEmpty({ message: 'Tags không được để trống', })
    tags: string;

    @ApiProperty({ example: 'mô tả sản phẩm', description: 'mô tả sản phẩm' })
    @IsNotEmpty({ message: 'Description không được để trống', })
    description: string;

    @IsOptional()
    @ApiProperty({ example: ['abc.xyz.com.vn'], description: 'ảnh' })
    // @IsNotEmpty({ message: 'Images không được để trống', })
    @IsArray({ message: 'Images phải là array' })
    @IsString({ each: true, message: "Image phải là string" })
    images: string[];

}

import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto, VariantDto } from './create-product.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";
import mongoose from "mongoose";
import { Type } from 'class-transformer';
export class UpdateProductDto {
    @ApiProperty({ example: '000001', description: 'mã product' })
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

    @ApiProperty({ example: 'mô tả sản phẩm', description: 'mô tả sản phẩm' })
    @IsNotEmpty({ message: 'Description không được để trống', })
    description: string;

    @IsOptional()
    @ApiProperty({ example: ['abc.xyz.com.vn'], description: 'ảnh' })
    // @IsNotEmpty({ message: 'Images không được để trống', })
    @IsArray({ message: 'Images phải là array' })
    @IsString({ each: true, message: "Image phải là string" })
    images: string[];
    @ApiProperty({ example: "featured", description: "Thẻ sản phẩm" })
    @IsOptional()
    @IsString({ message: "Tags phải là chuỗi" })
    tags: string;

    @ApiProperty({ example: "code1234", description: "code sản phẩm" })
    @IsOptional()
    @IsString({ message: "code phải là chuỗi" })
    code: string;

    @ApiProperty({ example: ["color", "size"], description: "Danh sách thuộc tính" })
    @IsArray({ message: "Features phải là một mảng" })
    @IsString({ each: true, message: "Mỗi feature phải là chuỗi" })
    @IsOptional()
    features: string[];

    @ApiProperty({
        example: [
            {
                attributes: {
                    color: { name: "red", desc: "link_img_red" },
                    size: { name: "M" }
                },
            }
        ],
        description: "Danh sách biến thể sản phẩm"
    })
    @ValidateNested({ each: true })
    @Type(() => VariantDto)
    @IsArray({ message: "Variants phải là một mảng" })
    @IsOptional()
    variants?: VariantDto[];
}

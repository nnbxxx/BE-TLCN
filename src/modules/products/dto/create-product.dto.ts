import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import mongoose from "mongoose";

export class CreateProductDto {
    @ApiProperty({ example: 'dior 0001', description: 'Tên product' })
    @IsNotEmpty({ message: 'Tên sản phẩm không được để trống', })
    name: string;

    @ApiProperty({ example: 'aaaaa', description: 'mã category' })
    @IsNotEmpty({ message: 'Category sản phẩm không được để trống', })
    category: string;

    @ApiProperty({ example: 'dior', description: 'tên thương hiệu' })
    @IsNotEmpty({ message: 'Brand không được để trống', })
    brand: string;

    @ApiProperty({ example: 12345, description: 'giá sản phẩm' })
    @Min(1, { message: 'Price phải là số dương' })
    @IsNumber({}, { message: 'Price phải là số nguyên', })
    @IsNotEmpty({ message: 'Giá không được để trống', })
    price: number;


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
    @IsOptional()
    @ApiProperty({ example: ['abc.xyz.com.vn'], description: 'ảnh' })
    // @IsNotEmpty({ message: 'Images không được để trống', })
    @IsArray({ message: 'Images phải là array' })
    @IsString({ each: true, message: "Image phải là string" })
    colors: string[];


    @ApiProperty({ example: 1000, description: 'số lượng trong kho' })
    @Min(1, { message: 'quantity phải là số dương' })
    @IsNumber({}, { message: 'quantity phải là số nguyên', })
    @IsNotEmpty({ message: 'quantity không được để trống', })
    quantity: number;
    // @ApiProperty({ example: 100, description: 'giảm giá' })
    // @Min(1, { message: 'discount phải là số dương' })
    // @Max(100, { message: 'discount tối đa là 100' })
    // @IsNumber({}, { message: 'discount phải là số nguyên', })
    // @IsNotEmpty({ message: 'discount không được để trống', })
    // discount: number;
}

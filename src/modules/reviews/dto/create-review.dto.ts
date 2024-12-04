import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";
import mongoose from "mongoose";

export class CreateReviewDto {
    @ApiProperty({ example: '66fa38a7f037dc5950953765', description: 'userId' })
    @IsMongoId({ message: "userId phải là mongo id" })
    @IsNotEmpty({ message: 'userId sản phẩm không được để trống', })
    userId: mongoose.Schema.Types.ObjectId;

    @ApiProperty({ example: '66f3d74a9a0b38cea549a180', description: 'productId' })
    @IsMongoId({ message: "productId phải là mongo id" })
    @IsNotEmpty({ message: 'productId sản phẩm không được để trống', })
    productId: mongoose.Schema.Types.ObjectId;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ApiProperty({ example: ['123.vn.vn', '456.abc.xyz'], description: 'fileUrl' })
    fileUrl?: string[];

    @IsNotEmpty({ message: 'rating sản phẩm không được để trống', })
    @Min(0, { message: 'rating phải >= 0' })
    @Max(5, { message: 'rating tối đa là 5' })
    @IsNumber({}, { message: 'rating phải là số nguyên', })
    @ApiProperty({ example: 5, description: 'rating' })
    rating: number;

    @ApiProperty({ example: `good products`, description: 'comment' })
    @IsNotEmpty({ message: 'comment sản phẩm không được để trống', })
    @IsString({ message: "comment phải là string" })
    comment: string;

}

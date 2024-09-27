import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class UpdateProductDto extends OmitType(CreateProductDto, [
] as const) {
    @IsNotEmpty({ message: '_id không được để trống' })
    _id: string;
}
export class ProductUpdateDtoSw {
    @ApiProperty({ example: 'Dior 333', description: 'Tên sản phẩm' })
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @ApiProperty({ example: `WONMAN'S FASHION`, description: 'Tên loại sp' })
    @IsMongoId({ message: "Category phải là mongo id" })
    @IsNotEmpty({ message: 'Category sản phẩm không được để trống', })
    category: mongoose.Schema.Types.ObjectId;
    @ApiProperty({ example: `Dior`, description: 'Tên loại sản phẩm' })
    @IsNotEmpty({ message: 'Category không được để trống' })
    brand: string;

    @ApiProperty({ example: 123456, description: 'Giá sản phẩm' })
    @IsNotEmpty({ message: 'Giá không được để trống' })
    price: number;

    @ApiProperty({ example: 'Dior nè', description: 'Description sản phẩm' })
    @IsNotEmpty({ message: 'Description không được để trống', })
    description: string;

    @ApiProperty({ example: 'Easy shop', description: 'Tên shop bán sản phẩm' })
    @IsNotEmpty({ message: 'Tên shop bán sản phẩm không được để trống' })
    shopName: string;

    @ApiProperty({ example: '123.com.vn', description: 'Ảnh sản phẩm' })
    @IsNotEmpty({ message: 'Image không được để trống', })
    image: string;

}
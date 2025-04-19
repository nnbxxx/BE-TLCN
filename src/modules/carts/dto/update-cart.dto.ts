import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProductAdd {
    @IsNotEmpty({ message: 'product_id không được để trống' })
    _id: string;
    @IsOptional()
    color: string;
    @IsOptional()
    size: string;

    @Min(1, { message: 'Price phải là số dương' })
    @IsNumber({}, { message: 'Price phải là số nguyên', })
    @IsNotEmpty({ message: 'Price không được để trống', })
    price: number;

    @Min(1, { message: 'Quantity phải là số dương' })
    @IsNumber({}, { message: 'Quantity phải là số nguyên', })
    @IsNotEmpty({ message: 'Quantity không được để trống', })
    quantity: number;
}
export class CartItem {
    @ValidateNested()
    @Type(() => ProductAdd)
    @IsNotEmpty()
    product: {
        _id: string,
        price: number,
        quantity: number,
        color: string,
        size: string
    }
}
export class UpdateToCartDto extends PartialType(CartItem) {

}


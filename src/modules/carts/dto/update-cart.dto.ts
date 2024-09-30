import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsMongoId, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProductAdd {
    @IsNotEmpty({ message: 'product không được để trống' })
    _id: string;

    @IsNotEmpty({ message: 'name không được để trống' })
    @IsString({ message: "name phải là string" }) // To make a field optional you can add @IsOptional
    name: string;
    @Min(1, { message: 'Price phải là số dương' })
    @IsNumber({}, { message: 'Price phải là số nguyên', })
    @IsNotEmpty({ message: 'Price không được để trống', })
    price: number;

    @Min(1, { message: 'Quantity phải là số dương' })
    @IsNumber({}, { message: 'Quantity phải là số nguyên', })
    @IsNotEmpty({ message: 'Quantity không được để trống', })
    quantity: number;
}
export class AddToCartDto {
    @ValidateNested()
    @Type(() => ProductAdd)
    @IsNotEmpty()
    product: {
        _id: string,
        name: string,
        price: number,
        quantity: number
    }
}
export class UpdateToCartDto extends PartialType(AddToCartDto) {

}


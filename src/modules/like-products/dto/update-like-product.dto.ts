import { PartialType } from '@nestjs/mapped-types';
import { CreateLikeProductDto } from './create-like-product.dto';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLikeProductDto extends PartialType(CreateLikeProductDto) { }


class ProductAdd {

    @IsNotEmpty({ message: 'product không được để trống' })
    _id: string;
    @IsNotEmpty({ message: 'name không được để trống' })
    @IsString({ message: "name phải là string" }) // To make a field optional you can add @IsOptional
    name: string;

}
export class ProductLikeItem {
    @ValidateNested()
    @Type(() => ProductAdd)
    @IsNotEmpty()

    product: {
        _id: string,
        name: string,
    }
}
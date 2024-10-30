import { Type } from "class-transformer";
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator"
import { Interface } from "readline";
import { AddressReceipt } from "./update-receipt.dto";
import { PAYMENT_METHOD } from "src/constants/schema.enum";
import { ApiProperty } from "@nestjs/swagger";

export interface IReceipt {

}

export class ReceiptDetailDTo {
    @IsMongoId({ message: 'productId phải là mongid' })
    @IsNotEmpty({ message: 'productId không được để trống' })
    @IsString({ message: "productId phải là string" })
    product: string
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

export class CreateReceiptDto {
    @ValidateNested({ each: true })
    @Type(() => ReceiptDetailDTo)
    items: ReceiptDetailDTo[]

    @IsArray({ message: 'coupons phải là array' })
    @IsOptional()
    @IsString({ each: true, message: "mã coupon phải là string" })
    coupons: string[];

    @IsNotEmpty({ message: 'supplier không được để trống' })
    @IsString({ message: "supplier phải là string" })
    supplier: string;

    @IsOptional()
    @IsString({ message: "name phải là string" })
    notes: string;

    @ValidateNested()
    @Type(() => AddressReceipt)
    @IsNotEmpty()
    address: {
        province: string,
        district: string,
        ward: string,
        detail: string
    }
    @IsNotEmpty({ message: 'paymentMethod không được để trống' })
    @IsEnum(PAYMENT_METHOD, { message: 'paymentMethod phải là enum ' })
    @ApiProperty({ example: PAYMENT_METHOD.COD, description: 'phương thức thanh toán' })

    paymentMethod: PAYMENT_METHOD
}

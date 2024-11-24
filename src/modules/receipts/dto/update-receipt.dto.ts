import { PartialType } from '@nestjs/mapped-types';
import { CreateReceiptDto, ReceiptDetailDTo } from './create-receipt.dto';
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RECEIPT_STATUS } from 'src/constants/schema.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
    @IsMongoId({ message: '_id phải là mongo id' })
    @IsNotEmpty({ message: '_id không được để trống' })
    _id: string;

    @IsEnum(RECEIPT_STATUS, { message: 'statusUser không được hợp lệ' })
    @IsNotEmpty({ message: 'statusUser không được để trống' })
    statusUser: string;

    @IsEnum(RECEIPT_STATUS, { message: 'statusSupplier không được hợp lệ' })
    @IsNotEmpty({ message: 'statusSupplier không được để trống' })
    statusSupplier: string;
}


export class UpdateReceiptDto {
    @IsMongoId({ message: '_id phải là mongo id' })
    @IsNotEmpty({ message: '_id không được để trống' })
    _id: string;

    @ValidateNested({ each: true })
    @Type(() => ReceiptDetailDTo)
    items: ReceiptDetailDTo[]

    @IsNotEmpty({ message: 'supplier không được để trống' })
    @IsString({ message: "supplier phải là string" })
    supplier: string;

    @IsString({ message: "name phải là string" })
    @IsNotEmpty({ message: 'supplier không được để trống' })
    notes: string;

    @IsEnum(RECEIPT_STATUS, { message: 'statusUser không được hợp lệ' })
    @IsNotEmpty({ message: 'statusUser không được để trống' })
    statusUser: string;

    @IsEnum(RECEIPT_STATUS, { message: 'statusSupplier không được hợp lệ' })
    @IsNotEmpty({ message: 'statusSupplier không được để trống' })
    statusSupplier: string;

    @ValidateNested()
    @Type(() => AddressReceipt)
    @IsNotEmpty()
    address: {
        province: string,
        district: string,
        ward: string,
        detail: string
    }

}
export class ReceiptAdd {
    @IsMongoId({ message: '_id phải là mongo id' })
    @IsNotEmpty({ message: '_id không được để trống' })
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
export class ReceiptItem {
    @ValidateNested()
    @Type(() => ReceiptAdd)
    @IsNotEmpty()
    product: {
        _id: string,
        name: string,
        price: number,
        quantity: number
    }
}
export class AddressReceipt {

    @IsNotEmpty({ message: 'province không được để trống' })
    @IsString({ message: "province phải là string" }) // To make a field optional you can add @IsOptional
    province: string;

    @IsNotEmpty({ message: 'district không được để trống' })
    @IsString({ message: "district phải là string" }) // To make a field optional you can add @IsOptional
    district: string;

    @IsNotEmpty({ message: 'ward không được để trống' })
    @IsString({ message: "ward phải là string" }) // To make a field optional you can add @IsOptional
    ward: string;

    @IsNotEmpty({ message: 'detail không được để trống' })
    @IsString({ message: "detail phải là string" }) // To make a field optional you can add @IsOptional
    detail: string;

}
export class IdSW {
    @ApiProperty({ example: '66fc6cc09bc7b3960846313f', description: 'Id ' })
    @IsNotEmpty({ message: 'Id không được để trống' })
    id: string;
}
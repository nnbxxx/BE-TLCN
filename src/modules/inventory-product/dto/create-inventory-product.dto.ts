import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class CreateInventoryProductDto {
    @IsMongoId({ message: 'productId có dạng mongodb id' })
    @IsNotEmpty({ message: 'productId không được để trống' })
    productId: string;
    @Min(1, { message: 'Quantity phải là số dương' })
    @IsNumber({}, { message: 'Quantity phải là số nguyên', })
    @IsNotEmpty({ message: 'Quantity không được để trống', })
    quantity: number;
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ReservationProduct)
    reservations: ReservationProduct[]

}

export class ReservationProduct {
    @IsMongoId({ message: 'userId có dạng mongodb id' })
    @IsNotEmpty({ message: 'userId không được để trống' })
    userId: string;

    @Min(1, { message: 'Quantity phải là số dương' })
    @IsNumber({}, { message: 'Quantity phải là số nguyên', })
    @IsNotEmpty({ message: 'Quantity không được để trống', })
    price: number;
    @Min(1, { message: 'Quantity phải là số dương' })
    @IsNumber({}, { message: 'Quantity phải là số nguyên', })
    @IsNotEmpty({ message: 'Quantity không được để trống', })
    quantity: number;
}
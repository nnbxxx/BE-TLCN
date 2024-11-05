import { IsMongoId, IsNotEmpty, IsNumberString, IsString } from "class-validator";
import { Types } from "mongoose";

export class PaymentUrlDto {
    @IsString()
    @IsMongoId({ message: '_id phải có dạng là mongo id' })
    @IsNotEmpty({ message: '_id không được để trống' })
    orderId: string;

    @IsNumberString()
    @IsNotEmpty()
    total: number;
}
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, Min, Validate, ValidateNested } from "class-validator";
import { TYPE_COUPONS } from "src/constants/schema.enum";
import { IsCouponDescription } from "src/modules/carts/dto/IsCouponDescription";

export class CouponPrice {
    @Min(1, { message: 'Price phải là số dương' })
    @IsNumber({}, { message: 'Price phải là số nguyên', })
    @IsNotEmpty({ message: 'Price không được để trống', })
    value: number;
    @Min(1, { message: 'Price phải là số dương' })
    @IsNumber({}, { message: 'Price phải là số nguyên', })
    @IsNotEmpty({ message: 'Price không được để trống', })
    pointAccept: number;
}
const example = {
    value: 10,
    pointAccept: 20,
}
export class CouponDiscount {
    @Min(1, { message: 'Price phải là số dương' })
    @IsNumber({}, { message: 'Price phải là số nguyên', })
    @IsNotEmpty({ message: 'Price không được để trống', })
    value: number;
    @Min(1, { message: 'Price phải là số dương' })
    @IsNumber({}, { message: 'Price phải là số nguyên', })
    @IsNotEmpty({ message: 'Price không được để trống', })
    maxDiscount: number;
    @Min(1, { message: 'Price phải là số dương' })
    @IsNumber({}, { message: 'Price phải là số nguyên', })
    @IsNotEmpty({ message: 'Price không được để trống', })
    pointAccept: number;
}
export class CreateCouponDto {
    @IsNotEmpty({ message: 'Mã code không được để trống' })
    @ApiProperty({ example: 'COUPOUNS01', description: 'Mã code' })

    code: string;
    @IsNotEmpty({ message: 'Mô tả không được để trống' })
    @ApiProperty({ example: 'Khuyến mãi 1: giảm 10k', description: 'Mô tả tên code' })
    name: string;
    @IsEnum(TYPE_COUPONS, { message: 'type coupon không được hợp lệ' })
    @IsNotEmpty({ message: 'type coupon không được để trống' })
    @ApiProperty({ example: 'PRICE', description: 'Loại code' })
    type: string;
    @ApiProperty({ example: 19, description: 'Số lượng code' })
    @Min(1, { message: 'số lượng phải là số dương' })
    @IsNumber({}, { message: 'số lượng phải là số nguyên', })
    @IsNotEmpty({ message: 'số lượng không được để trống', })
    quantity: number;
    @ApiProperty({ example: '2024-10-22T14:30:00.000Z', description: 'Ngày hết hạn' })
    @IsNotEmpty({ message: 'ngày hết hạn không được để trống' })
    couponExpired: string;
    @ApiProperty({ example: example, description: 'Chi tiết code' })
    @Type(() => {
        // Tạo một hàm để xác định kiểu dữ liệu
        return class {
            value: number
            maxDiscount?: number
            pointAccept: number
        };
    })
    @IsNotEmpty()
    description: CouponPrice | CouponDiscount;

}

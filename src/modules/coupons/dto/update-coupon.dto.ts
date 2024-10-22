import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponDto } from './create-coupon.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
    @IsMongoId({ message: '_id có dạng mongodb id' })
    @IsNotEmpty({ message: '_id không được để trống' })
    _id: string;
}

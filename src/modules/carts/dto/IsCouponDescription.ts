import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { CouponDiscount, CouponPrice } from 'src/modules/coupons/dto/create-coupon.dto';

@ValidatorConstraint({ name: 'IsCouponDescription', async: false })
export class IsCouponDescription implements ValidatorConstraintInterface {
    validate(description: any, args: ValidationArguments) {
        return description instanceof CouponPrice || description instanceof CouponDiscount;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Description must be an instance of CouponPrice or CouponDiscount';
    }
}

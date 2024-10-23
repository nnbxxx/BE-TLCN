import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from './schemas/coupon.schemas';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]), UsersModule, NotificationsModule],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService]
})
export class CouponsModule { }

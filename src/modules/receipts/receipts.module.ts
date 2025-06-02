import { forwardRef, Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Receipt, ReceiptSchema } from './schemas/receipt.schemas';
import { ProductsModule } from '../products/products.module';
import { CartsModule } from '../carts/carts.module';
import { UsersModule } from '../users/users.module';
import { InventoryProductModule } from '../inventory-product/inventory-product.module';
import { CouponsService } from '../coupons/coupons.service';
import { CouponsModule } from '../coupons/coupons.module';
import { AddressUserModule } from '../address-user/address-user.module';
import { Coupon, CouponSchema } from '../coupons/schemas/coupon.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: Receipt.name, schema: ReceiptSchema }, { name: Coupon.name, schema: CouponSchema }])
    , forwardRef(() => ProductsModule)
    , CartsModule
    , UsersModule
    , InventoryProductModule
    , CouponsModule
    , AddressUserModule],
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
  exports: [ReceiptsService]
})
export class ReceiptsModule { }

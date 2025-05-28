import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/modules/blog/schemas/blog.schemas';
import { User, UserSchema } from 'src/modules/users/schemas/user.schema';
import { Receipt, ReceiptSchema } from 'src/modules/receipts/schemas/receipt.schemas';
import { InventoryProductModule } from 'src/modules/inventory-product/inventory-product.module';
import { Brand, BrandSchema } from 'src/brand/schemas/brand.schemas';
import { InventoryProduct, InventoryProductSchema } from 'src/modules/inventory-product/schemas/inventory-product.schemas';
import { LikeProduct, LikeProductSchema } from 'src/modules/like-products/schemas/like-product.schemas';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Blog.name, schema: BlogSchema },
    { name: User.name, schema: UserSchema },
    { name: Receipt.name, schema: ReceiptSchema },
    { name: Brand.name, schema: BrandSchema },
    { name: InventoryProduct.name, schema: InventoryProductSchema },
    { name: Receipt.name, schema: ReceiptSchema },
    { name: LikeProduct.name, schema: LikeProductSchema },
  ]),
    InventoryProductModule
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService]
})
export class DashboardModule { }

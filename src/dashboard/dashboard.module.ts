import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/modules/blog/schemas/blog.schemas';
import { User, UserSchema } from 'src/modules/users/schemas/user.schema';
import { Receipt, ReceiptSchema } from 'src/modules/receipts/schemas/receipt.schemas';
import { InventoryProductModule } from 'src/modules/inventory-product/inventory-product.module';
import { Brand, BrandSchema } from 'src/brand/schemas/brand.schemas';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Blog.name, schema: BlogSchema },
    { name: User.name, schema: UserSchema },
    { name: Receipt.name, schema: ReceiptSchema },
    { name: Brand.name, schema: BrandSchema },

  ]),
    InventoryProductModule
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService]
})
export class DashboardModule { }

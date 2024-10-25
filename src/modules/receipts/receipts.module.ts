import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Receipt, ReceiptSchema } from './schemas/receipt.schemas';
import { ProductsModule } from '../products/products.module';
import { CartsModule } from '../carts/carts.module';
import { UsersModule } from '../users/users.module';
import { InventoryProductModule } from '../inventory-product/inventory-product.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Receipt.name, schema: ReceiptSchema }]), ProductsModule, CartsModule, UsersModule, InventoryProductModule],
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
  exports: [ReceiptsService]
})
export class ReceiptsModule { }

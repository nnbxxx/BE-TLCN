import { Module } from '@nestjs/common';
import { InventoryProductService } from './inventory-product.service';
import { InventoryProductController } from './inventory-product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryProduct, InventoryProductSchema } from './schemas/inventory-product.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: InventoryProduct.name, schema: InventoryProductSchema }])],
  controllers: [InventoryProductController],
  providers: [InventoryProductService],
  exports: [InventoryProductService]
})
export class InventoryProductModule { }

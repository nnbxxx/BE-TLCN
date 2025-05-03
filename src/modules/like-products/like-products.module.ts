import { Module } from '@nestjs/common';
import { LikeProductsService } from './like-products.service';
import { LikeProductsController } from './like-products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeProduct, LikeProductSchema } from './schemas/like-product.schemas';
import { InventoryProductModule } from '../inventory-product/inventory-product.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: LikeProduct.name, schema: LikeProductSchema }]),
    InventoryProductModule,
    ProductsModule
  ],
  controllers: [LikeProductsController],
  providers: [LikeProductsService],
  exports: [LikeProductsService]
})
export class LikeProductsModule { }

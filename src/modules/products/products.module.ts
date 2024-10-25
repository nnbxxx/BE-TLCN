import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schemas';
import { UsersModule } from '../users/users.module';
import { InventoryProductModule } from '../inventory-product/inventory-product.module';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), UsersModule, InventoryProductModule, ReviewsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule { }

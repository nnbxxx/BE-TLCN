import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schemas';
import { ProductsModule } from '../products/products.module';
import { InventoryProductModule } from '../inventory-product/inventory-product.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductsModule, InventoryProductModule],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService]
})
export class CartsModule { }

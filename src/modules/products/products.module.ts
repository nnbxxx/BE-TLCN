import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schemas';
import { UsersModule } from '../users/users.module';
import { InventoryProductModule } from '../inventory-product/inventory-product.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { CategoriesModule } from '../categories/categories.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }, { name: User.name, schema: UserSchema }]),
    UsersModule,
    InventoryProductModule,
  forwardRef(() => ReviewsModule),
    CategoriesModule, NotificationsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule { }

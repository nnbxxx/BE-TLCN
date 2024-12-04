import { forwardRef, Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/review.schemas';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { Product, ProductSchema } from '../products/schemas/product.schemas';
import { ReceiptsModule } from '../receipts/receipts.module';
import { Receipt, ReceiptSchema } from '../receipts/schemas/receipt.schemas';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Review.name, schema: ReviewSchema },
    { name: Product.name, schema: ProductSchema },
    { name: Receipt.name, schema: ReceiptSchema },

  ]), UsersModule,
  forwardRef(() => ReceiptsModule),

  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService]
})
export class ReviewsModule { }

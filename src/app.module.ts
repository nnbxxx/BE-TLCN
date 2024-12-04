import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CartsModule } from './modules/carts/carts.module';
import { AddressModule } from './modules/address/addresses.module';
import { ReceiptsModule } from './modules/receipts/receipts.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { LikeProductsModule } from './modules/like-products/like-products.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FilesModule } from './modules/files/files.module';
import { InventoryProduct } from './modules/inventory-product/schemas/inventory-product.schemas';
import { InventoryProductModule } from './modules/inventory-product/inventory-product.module';
import { AddressUserModule } from './modules/address-user/address-user.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { DatabasesModule } from './databases/databases.module';
import { MessageModule } from './modules/message/message.module';
import { ChatRoomsModule } from './modules/chat-rooms/chat-rooms.module';
import { ColorModule } from './color/color.module';
import { BrandModule } from './brand/brand.module';
import { BlogCategoryModule } from './blog-category/blog-category.module';
import { BlogModule } from './modules/blog/blog.module';
import { DashboardModule } from './dashboard/dashboard.module';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    // Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    // Mongoose Module
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (
        {
          uri: configService.get<string>('MONGODB_URI'),
          connectionFactory: (connection) => {
            connection.plugin(softDeletePlugin);
            return connection;
          },
        }
      ),
    }),
    // Throttler Module
    ThrottlerModule.forRoot(),
    UsersModule,
    AuthModule,
    MailModule,
    ProductsModule,
    CategoriesModule,
    CartsModule,
    AddressModule,
    ReceiptsModule,
    ReviewsModule,
    LikeProductsModule,
    CouponsModule,
    NotificationsModule,
    CloudinaryModule,
    FilesModule,
    InventoryProductModule,
    AddressUserModule,
    PermissionsModule,
    // RolesModule,
    DatabasesModule,
    ChatRoomsModule,
    MessageModule,
    ColorModule,
    BrandModule,
    BlogCategoryModule,
    BlogModule,
    DashboardModule,

  ],
  controllers: [AppController],
  providers: [
    AppService, NotificationsGateway,
    // bind to ThrottlerGuard globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // }
  ],



})
export class AppModule { }

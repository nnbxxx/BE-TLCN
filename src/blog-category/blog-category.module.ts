import { Module } from '@nestjs/common';
import { BlogCategoryService } from './blog-category.service';
import { BlogCategoryController } from './blog-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogCategory, BlogCategorySchema } from './schemas/blog-category.schemas';

@Module({
  controllers: [BlogCategoryController],
  providers: [BlogCategoryService],
  imports: [MongooseModule.forFeature([{ name: BlogCategory.name, schema: BlogCategorySchema }])],
  exports: [BlogCategoryService],

})
export class BlogCategoryModule { }

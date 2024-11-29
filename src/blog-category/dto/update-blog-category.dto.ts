import { PartialType } from '@nestjs/swagger';
import { CreateBlogCategoryDto } from './create-blog-category.dto';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBlogCategoryDto
// extends PartialType(CreateBlogCategoryDto) 
{
    @IsMongoId({ message: '_id phải có dạng là mongo id' })
    @IsNotEmpty({ message: '_id không được để trống' })
    _id: string;
    @IsString({ message: "tên phải là chuỗi" })
    @IsNotEmpty({ message: 'tên không được để trống' })
    subject: string;
}

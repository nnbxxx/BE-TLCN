import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
     @IsMongoId({ message: '_id phải có dạng là mongo id' })
     @IsNotEmpty({ message: '_id không được để trống' })
     _id: string;
}

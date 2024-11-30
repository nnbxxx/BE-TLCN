import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBlogDto {
    @ApiProperty({ example: 'Hoàng bào, vật dụng cung đình triều Nguyễn ở Sài Gòn', description: 'Tiêu đề' })
    @IsNotEmpty({ message: 'Tên sản phẩm không được để trống', })
    title: string;
    @ApiProperty({ example: 'Hoàng bào, vật dụng cung đình triều Nguyễn ở Sài Gòn', description: 'Tiêu đề' })
    @IsNotEmpty({ message: 'Tên sản phẩm không được để trống', })
    description: string;
    @ApiProperty({ example: 'abcxyz', description: 'mã category' })
    @IsNotEmpty({ message: 'Category sản phẩm không được để trống', })
    category: string;

    @IsOptional()
    @ApiProperty({ example: ['abc.xyz.com.vn'], description: 'ảnh' })
    // @IsNotEmpty({ message: 'Images không được để trống', })
    @IsArray({ message: 'Images phải là array' })
    @IsString({ each: true, message: "Image phải là string" })
    images: string[];
}

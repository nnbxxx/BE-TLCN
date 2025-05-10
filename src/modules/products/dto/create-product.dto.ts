import { ApiProperty } from "@nestjs/swagger";
import {
    IsArray,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

class AttributeDto {
    @ApiProperty({ example: "red", description: "Tên thuộc tính (VD: màu sắc, kích thước...)" })
    @IsNotEmpty({ message: "Tên thuộc tính không được để trống" })
    @IsString({ message: "Tên thuộc tính phải là chuỗi" })
    name: string;

    @ApiProperty({ example: "link_img_red", description: "Mô tả hoặc ảnh minh họa (nếu có)" })
    @IsOptional()
    @IsString({ message: "Mô tả thuộc tính phải là chuỗi" })
    desc?: string;
}

class VariantDto {
    @ApiProperty({ example: { color: { name: "red", desc: "link_img_red" } }, description: "Thuộc tính biến thể" })
    @IsNotEmpty({ message: "Attributes không được để trống" })
    attributes: Record<string, AttributeDto>;
}

export class CreateProductDto {
    @ApiProperty({ example: "Áo Thun Nam", description: "Tên sản phẩm" })
    @IsNotEmpty({ message: "Tên sản phẩm không được để trống" })
    name: string;

    @ApiProperty({ example: "64b76d2a2a3f1c6abc123456", description: "ID danh mục sản phẩm" })
    @IsMongoId({ message: "Danh mục không hợp lệ" })
    @IsNotEmpty({ message: "Danh mục không được để trống" })
    category: string;

    @ApiProperty({ example: "BrandX", description: "Thương hiệu" })
    @IsNotEmpty({ message: "Thương hiệu không được để trống" })
    brand: string;

    @ApiProperty({ example: "Sản phẩm thời trang cao cấp", description: "Mô tả sản phẩm" })
    @IsNotEmpty({ message: "Mô tả sản phẩm không được để trống" })
    description: string;

    @ApiProperty({ example: ["image1.jpg", "image2.jpg"], description: "Danh sách hình ảnh" })
    @IsOptional()
    @IsArray({ message: "Hình ảnh phải là mảng" })
    @IsString({ each: true, message: "Mỗi hình ảnh phải là chuỗi" })
    images: string[];

    @ApiProperty({ example: "featured", description: "Thẻ sản phẩm" })
    @IsNotEmpty({ message: "Tags không được để trống" })
    @IsString({ message: "Tags phải là chuỗi" })
    tags: string;

    @ApiProperty({ example: "code1234", description: "code sản phẩm" })
    @IsNotEmpty({ message: "code không được để trống" })
    @IsString({ message: "code phải là chuỗi" })
    code: string;

    @ApiProperty({ example: ["color", "size"], description: "Danh sách thuộc tính" })
    @IsArray({ message: "Features phải là một mảng" })
    @IsString({ each: true, message: "Mỗi feature phải là chuỗi" })
    @IsNotEmpty({ message: "Features không được để trống" })
    features: string[];

    @ApiProperty({
        example: [
            {
                attributes: {
                    color: { name: "red", desc: "link_img_red" },
                    size: { name: "M" }
                },
            }
        ],
        description: "Danh sách biến thể sản phẩm"
    })
    @ValidateNested({ each: true })
    @Type(() => VariantDto)
    @IsArray({ message: "Variants phải là một mảng" })
    @IsOptional()
    variants?: VariantDto[];
}

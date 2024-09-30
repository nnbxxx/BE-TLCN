import { IsMongoId, IsNotEmpty, IsNumber, Min } from "class-validator";
import mongoose from "mongoose";

export class CreateProductDto {
    @IsNotEmpty({ message: 'Tên sản phẩm không được để trống', })
    name: string;

    @IsMongoId({ message: "Category phải là mongo id" })
    @IsNotEmpty({ message: 'Category sản phẩm không được để trống', })
    category: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'Brand không được để trống', })
    brand: string;

    @Min(1, { message: 'Price phải là số dương' })
    @IsNumber({}, { message: 'Price phải là số nguyên', })
    @IsNotEmpty({ message: 'Giá không được để trống', })
    price: number;

    @IsNotEmpty({ message: 'Description không được để trống', })
    description: string;

    @IsNotEmpty({ message: 'Tên shop sản phẩm không được để trống', })
    shopName: string;

    @IsNotEmpty({ message: 'Image không được để trống', })
    image: string;

    @Min(1, { message: 'Stock phải là số dương' })
    @IsNumber({}, { message: 'Stock phải là số nguyên', })
    @IsNotEmpty({ message: 'Image không được để trống', })
    stock: number;
}

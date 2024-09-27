import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateProductDto {
    @IsNotEmpty({ message: 'Tên sản phẩm không được để trống', })
    name: string;

    @IsMongoId({ message: "Category phải là mongo id" })
    @IsNotEmpty({ message: 'Category sản phẩm không được để trống', })
    category: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'Brand không được để trống', })
    brand: string;

    @IsNotEmpty({ message: 'Giá không được để trống', })
    price: number;

    @IsNotEmpty({ message: 'Description không được để trống', })
    description: string;

    @IsNotEmpty({ message: 'Tên shop sản phẩm không được để trống', })
    shopName: string;

    @IsNotEmpty({ message: 'Image không được để trống', })
    image: string;


}

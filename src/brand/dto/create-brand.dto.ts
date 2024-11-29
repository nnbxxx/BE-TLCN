import { IsNotEmpty, IsString } from "class-validator";

export class CreateBrandDto {
    @IsString({ message: "tên phải là chuỗi" })
    @IsNotEmpty({ message: 'tên không được để trống' })
    brand: string;
}

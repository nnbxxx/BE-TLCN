import { IsNotEmpty, IsString } from "class-validator";

export class CreateColorDto {
    @IsString({ message: "Màu phải là chuỗi" })
    @IsNotEmpty({ message: 'Ảnh không được để trống' })
    color: string;
}
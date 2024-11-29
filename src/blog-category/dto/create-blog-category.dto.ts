import { IsNotEmpty, IsString } from "class-validator";

export class CreateBlogCategoryDto {
    @IsString({ message: "tên phải là chuỗi" })
    @IsNotEmpty({ message: 'tên không được để trống' })
    subject: string;
}

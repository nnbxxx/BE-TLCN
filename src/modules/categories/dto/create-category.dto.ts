import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;
}
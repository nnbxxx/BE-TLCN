import { IsNotEmpty } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({ message: 'Name không được để trống', })
    name: string;

    @IsNotEmpty({ message: 'Address không được để trống', })
    type: string;

    @IsNotEmpty({ message: 'Description không được để trống', })
    description: string;

}

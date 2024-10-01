import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
class Wards {
    @IsString({ message: "Id phải là string" })
    Id: string;

    @IsString({ message: "name phải là string" })
    Name: string;

    @IsString({ message: "Level phải là string" })
    Level: string;
}
class Districts {
    @IsNotEmpty({ message: 'Id không được để trống' })
    @IsString({ message: "Id phải là string" })
    Id: string;

    @IsNotEmpty({ message: 'name không được để trống' })
    @IsString({ message: "name phải là string" })
    Name: string;

    @ValidateNested({ each: true })
    @Type(() => Wards)
    Wards: Wards[]

}
export class CreateAddressDto {
    @ValidateNested({ each: true })
    @Type(() => Districts)
    Districts: Districts[]

    @IsNotEmpty({ message: 'Id không được để trống' })
    @IsString({ message: "Id phải là string" })
    Id: string;

    @IsNotEmpty({ message: 'name không được để trống' })
    @IsString({ message: "name phải là string" })
    Name: string;
}
export class CreateAddressMultipleDto {
    @ValidateNested({ each: true })
    @Type(() => CreateAddressDto)
    data: CreateAddressDto[]
}
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateDashboardDto { }
export class DataRevenueDto {
    @IsNotEmpty({ message: "year không được để trống" })
    @IsNumber({}, { message: 'year phải là số nguyên', })
    year: number
}

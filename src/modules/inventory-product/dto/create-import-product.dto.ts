import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ImportVariantDto {
    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsString()
    size?: string;

    @IsOptional()
    @IsString()
    material?: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    importPrice: number;
}

export class ImportStockDto {
    @IsMongoId()
    productId: string;
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImportVariantDto)
    variants: ImportVariantDto[];

}

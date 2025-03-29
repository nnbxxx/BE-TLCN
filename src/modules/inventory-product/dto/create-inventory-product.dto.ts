import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested, IsArray, IsEnum } from "class-validator";
import { Type } from "class-transformer";

// DTO cho biến thể sản phẩm trong kho
class ProductVariantDto {
    @IsString()
    @IsNotEmpty({ message: 'Color không được để trống' })
    color: string;

    @IsOptional()
    @IsString()
    size?: string;

    @IsOptional()
    @IsString()
    material?: string;

    @Min(0, { message: 'Import Price phải là số dương' })
    @IsNumber({}, { message: 'Import Price phải là số nguyên' })
    @IsNotEmpty({ message: 'Import Price không được để trống' })
    importPrice: number;

    @IsString()
    @IsNotEmpty({ message: 'Export Price không được để trống' })
    exportPrice: string; // Giá xuất (có thể là tỷ lệ phần trăm hoặc số cố định)

    @Min(0, { message: 'Stock phải là số dương' })
    @IsNumber({}, { message: 'Stock phải là số nguyên' })
    @IsNotEmpty({ message: 'Stock không được để trống' })
    stock: number; // Số lượng tồn kho
}

// DTO cho lịch sử nhập hàng và xuất hàng
class StockHistoryDto {
    @IsMongoId({ message: 'userId có dạng mongodb id' })
    @IsNotEmpty({ message: 'userId không được để trống' })
    userId: string;

    @Min(1, { message: 'Quantity phải là số dương' })
    @IsNumber({}, { message: 'Quantity phải là số nguyên' })
    @IsNotEmpty({ message: 'Quantity không được để trống' })
    quantity: number;

    @Min(1, { message: 'Price phải là số dương' })
    @IsNumber({}, { message: 'Price phải là số nguyên' })
    @IsNotEmpty({ message: 'Price không được để trống' })
    price: number;

    @IsEnum(['import', 'export'], { message: 'Action phải là "import" hoặc "export"' })
    @IsNotEmpty({ message: 'Action không được để trống' })
    action: 'import' | 'export';

    @IsString()
    @IsNotEmpty({ message: 'Date không được để trống' })
    date: string;
}

// DTO cho sản phẩm trong kho
export class CreateInventoryProductDto {
    @IsMongoId({ message: 'productId có dạng mongodb id' })
    @IsNotEmpty({ message: 'productId không được để trống' })
    productId: string;

    @IsOptional()
    @IsArray({ message: 'Product Variants phải là mảng' })
    @ValidateNested({ each: true })
    @Type(() => ProductVariantDto)
    productVariants: ProductVariantDto[]; // Mảng các biến thể sản phẩm

}

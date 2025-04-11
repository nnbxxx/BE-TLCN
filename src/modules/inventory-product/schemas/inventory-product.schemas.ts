import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Product } from "src/modules/products/schemas/product.schemas";
import { User } from "src/modules/users/schemas/user.schema";
import { Color } from "src/color/schemas/color.schemas";

export type InventoryProductDocument = HydratedDocument<InventoryProduct>;

// Chi tiết biến thể sản phẩm trong kho
export class ProductVariant {
    @Prop({ type: Map, of: String, required: false })
    attributes: Record<string, any>; // Lưu trữ các thuộc tính như color, size, material, hoặc bất kỳ thuộc tính nào khác

    @Prop({ type: Number, default: 0 })
    importPrice: number; // Giá nhập

    @Prop({ type: Number, default: 0, min: 0, max: 100 }) // Có thể là % hoặc số cố định
    exportPrice: number; // Giá xuất

    @Prop({ type: Number, default: 0 }) //  Số cố định
    sellPrice: number; // Giá xuất

    @Prop({ type: Number, default: 0 })
    stock: number; // Số lượng tồn kho

    @Prop({ default: 0 })
    discount: number;
}

// Lịch sử nhập hàng và xuất hàng
class StockHistory {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    userId: mongoose.Schema.Types.ObjectId; // Người thực hiện

    @Prop({ required: true })
    quantity: number; // Số lượng

    @Prop({ required: true })
    price: number; // Giá trị (giá nhập hoặc giá xuất)

    @Prop({ required: true, enum: ['import', 'export'] })
    action: 'import' | 'export'; // Loại hành động (nhập hoặc xuất)

    @Prop({ default: Date.now })
    date: Date; // Thời gian thực hiện
    @Prop()
    variants: any
}

@Schema({ timestamps: true })
export class InventoryProduct {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Product.name })
    productId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: [ProductVariant], default: [] })
    productVariants: ProductVariant[]; // Danh sách biến thể sản phẩm

    @Prop({ type: Number, default: 0 })
    totalQuantity: number; // Tổng số lượng sản phẩm (tính từ tất cả variants)
    @Prop({ type: Number, default: 0 })
    totalQuantitySell: number; // Tổng số lượng sản phẩm đã bán

    @Prop({
        type: {
            _id: { type: mongoose.Schema.Types.ObjectId, required: true },
            email: { type: String, required: true }
        }
    })
    createdBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

    @Prop({
        type: {
            _id: { type: mongoose.Schema.Types.ObjectId, required: true },
            email: { type: String, required: true }
        }
    })
    updatedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

    @Prop({
        type: {
            _id: { type: mongoose.Schema.Types.ObjectId, required: true },
            email: { type: String, required: true }
        }
    })
    deletedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;

    // Lịch sử nhập hàng và xuất hàng
    @Prop({ type: [StockHistory], default: [] })
    stockHistory: StockHistory[];
}

export const InventoryProductSchema = SchemaFactory.createForClass(InventoryProduct);

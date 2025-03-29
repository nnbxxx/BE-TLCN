import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Color } from "src/color/schemas/color.schemas";
import { Category } from "src/modules/categories/schemas/category.Schemas";

export type ProductDocument = HydratedDocument<Product>;

@Schema()
class Variant {
    @Prop({ type: Object, required: true })
    attributes: Record<string, any>;
}

const VariantSchema = SchemaFactory.createForClass(Variant);

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name, required: true })
    category: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    brand: string;

    @Prop({ required: true })
    description: string;

    @Prop({ type: [String], default: [] })
    images: string[];

    @Prop({ default: 0 })
    rating: number;

    @Prop({ type: String, default: "" })
    tags: string;

    @Prop({ type: [String], default: [] })
    features: string[]; // Danh sách thuộc tính động

    @Prop({ type: [VariantSchema], default: [] })
    variants: Variant[];

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// cục FE build sản phẩm
const product = {
    "name": "Áo Thun Nam",
    "category": "64b76d2a2a3f1c6abc123456",
    "brand": "BrandX",
    "description": "Áo thun nam cao cấp",
    "images": ["image1.jpg", "image2.jpg"],
    "rating": 4.5,
    "tags": "featured",
    "feature": ["color", "size", "chất liệu"],
    // Danh sách biến thể sản phẩm (màu + size + giá + giảm giá + tồn kho)
    "variants": [
        {
            "color": { "name": "red", "decs": "link_img_red" },
            "size": { "name": "M", "decs": "" },
            "chất liệu": { "name": "Chất liệu x", "decs": "" },
        },
        //...

    ]
};

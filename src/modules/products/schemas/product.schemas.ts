import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Category } from "src/modules/categories/schemas/category.Schemas";

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Category.name })
    category: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    brand: string;

    @Prop({ required: true })
    price: number;

    // Số sản phẩm trong kho
    @Prop({ default: 0 })
    stock: number;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    shopName: string;

    @Prop({ required: true })
    image: string;

    @Prop({ default: 0 })
    rating: string;

    // Số sản phẩm bán được
    @Prop({ default: 0 })
    quantitySold: number;

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

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
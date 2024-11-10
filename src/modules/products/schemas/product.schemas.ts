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

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    shopName: string;

    @Prop({
        default: [],
        type: [String]
    })
    images: string[];

    @Prop({ default: 0 })
    rating: number;
    @Prop({ default: 0 })
    discount: number;

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


export class DescriptionProduct {
    key: string;
    value: [];
}
const x = {
    decription: [
        {
            k: 'color',
            v: [{
                color: 'red',
                img: 'abc xyz',
            }, {
                color: 'blue',
                img: 'abc xyz',
            }]
        }, {
            k: 'size',
            v: [{
                size: 'x',
                decs: "cho x đến y kg"

            }, {
                size: 'xl',
                decs: "cho x đến y kg"

            }, {
                size: 'xxl',
                decs: "cho x đến y kg"

            }]
        }
    ]
}
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Product } from "src/modules/products/schemas/product.schemas";
import { ReservationProduct } from "../dto/create-inventory-product.dto";
import { User } from "src/modules/users/schemas/user.schema";
import { Color } from "src/color/schemas/color.schemas";

export type InventoryProductDocument = HydratedDocument<InventoryProduct>;

@Schema({ timestamps: true })
export class InventoryProduct {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Product.name })
    productId: mongoose.Schema.Types.ObjectId;
    @Prop({ type: Number, default: 0 })
    quantity: number;

    // chi tiết các sản phẩm user mua
    @Prop({
        type: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: User.name, require: true, },
            color: { type: mongoose.Schema.Types.ObjectId, ref: Color.name, require: true, },
            quantity: { type: Number, require: true, },
            price: { type: Number, require: true, },
        }], default: []
    })
    reservations: [ReservationProduct]

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

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}


export const InventoryProductSchema = SchemaFactory.createForClass(InventoryProduct);

const test = {
    productId: '123',
    quantity: {
        "total": 1000,
        "red-xl": 1,
        "red-l": 2,
        "red-x": 3,
        "blue-xl": 4,
        "blue-xxl": 1,
        "black-x": 1
    },
    reservations: [],

}
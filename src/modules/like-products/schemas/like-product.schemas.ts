import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Product } from "src/modules/products/schemas/product.schemas";
import { User } from "src/modules/users/schemas/user.schema";
import { ProductLikeItem } from "../dto/update-like-product.dto";

export type LikeProductDocument = HydratedDocument<LikeProduct>;

@Schema({ timestamps: true })
export class LikeProduct {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    user: mongoose.Schema.Types.ObjectId;

    @Prop({
        require: true,
        type: [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: Product.name, require: true, },
            name: { type: String, require: true, },
        }]
    })
    items: ProductLikeItem[];

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


export const LikeProductSchema = SchemaFactory.createForClass(LikeProduct);

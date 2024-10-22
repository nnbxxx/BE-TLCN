import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { TYPE_COUPONS } from "src/constants/schema.enum";
import { CouponPrice, CouponDiscount } from '../dto/create-coupon.dto';

export type CouponDocument = HydratedDocument<Coupon>;
@Schema({ timestamps: true }) // biến class thành 1 schema // lấy time at
export class Coupon {
    @Prop({ required: true, unique: true })
    code: string;
    @Prop({ required: true })
    name: string;
    @Prop({ type: String, enum: TYPE_COUPONS, required: true })
    type: TYPE_COUPONS;

    @Prop({ type: Number, required: true })
    quantity: number;

    @Prop({ default: true, type: Boolean })
    isActive: boolean;

    @Prop({ default: Date.now, type: Date })
    couponExpired: Date;

    @Prop({ default: [], type: Array<Object> })
    reservations: [{
        _id: mongoose.Schema.Types.ObjectId,
        value: number
    }];

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
    @Prop({ type: MongooseSchema.Types.Mixed, required: true })
    description: CouponPrice | CouponDiscount;
    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

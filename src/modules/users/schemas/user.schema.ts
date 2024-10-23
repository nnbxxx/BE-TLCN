import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Coupon } from 'src/modules/coupons/schemas/coupon.schemas';
import { Product } from 'src/modules/products/schemas/product.schemas';
// import { Role } from 'src/roles/schemas/role.schemas';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true }) // biến class thành 1 schema // lấy time at
export class User {
    @Prop()
    name: string;

    @Prop({ required: true })
    email: string; // unique

    @Prop({ required: true })
    password: string;

    @Prop()
    age: number;

    @Prop()
    gender: string;

    @Prop()
    address: string;

    // @Prop({ type: Object })
    // company: {
    //     _id: mongoose.Schema.Types.ObjectId;
    //     email: string;
    // };

    // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
    // role: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, type: [mongoose.Schema.Types.ObjectId], ref: Product.name })
    purchasedProducts: [mongoose.Schema.Types.ObjectId];
    @Prop({ required: true, type: [mongoose.Schema.Types.ObjectId], ref: Product.name })
    recentViewProducts: [mongoose.Schema.Types.ObjectId];

    @Prop({
        type: [{
            _id: { type: mongoose.Schema.Types.ObjectId, ref: Coupon.name },
            isActive: { type: Boolean, required: true, default: false },
            name: { type: String, required: true },
            code: { type: String, required: true },
        }],
        required: true, default: []
    })
    couponsUser: [
        {
            _id: mongoose.Schema.Types.ObjectId,
            isActive: boolean,
            name: string,
            code: string
        }
    ];

    @Prop()
    refreshToken: string;

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    @Prop()
    image: string;

    @Prop({ default: "USERS" })
    role: string;
    @Prop({ default: 0 })
    point: number;

    @Prop({ default: "LOCAL" })
    accountType: string;

    @Prop({ default: false })
    isActive: boolean;

    @Prop()
    codeId: string;

    @Prop()
    codeExpired: Date;

    @Prop({ default: null })
    socketId: string;
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

export const UserSchema = SchemaFactory.createForClass(User);

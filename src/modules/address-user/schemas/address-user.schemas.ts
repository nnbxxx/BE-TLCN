import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/modules/users/schemas/user.schema";

export type AddressUserDocument = HydratedDocument<AddressUser>;

@Schema({ timestamps: true }) // biến class thành 1 schema // lấy time at
export class AddressUser {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    user: mongoose.Schema.Types.ObjectId;
    @Prop({ required: true, type: String })
    receiver: string;
    @Prop({ required: true, type: String })
    phone: string;
    @Prop({ required: true, type: String })
    province: string;
    @Prop({ required: true, type: String })
    districts: string;
    @Prop({ required: true, type: String })
    wards: string;
    @Prop({ required: true, type: String })
    specific: string;
    @Prop({ type: Boolean, required: true })
    isDefault: boolean
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
    @Prop()
    isDeleted: boolean;
    @Prop()
    deletedAt: Date;
}

export const AddressUserSchema = SchemaFactory.createForClass(AddressUser);

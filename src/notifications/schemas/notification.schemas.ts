import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/modules/users/schemas/user.schema";


export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    userId: mongoose.Schema.Types.ObjectId;
    @Prop({ default: `` })
    title: string;
    @Prop({ default: `` })
    message: string;
    @Prop({ default: false })
    isRead: boolean;
    @Prop({ default: `https://www.google.com/` })
    navigate: string;
    @Prop({ default: Date.now })
    createdAt: Date;
    @Prop()
    updatedAt: Date;
    @Prop()
    isDeleted: boolean;
    @Prop()
    deletedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);


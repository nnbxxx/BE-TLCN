import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Message } from "src/modules/message/schemas/message.schemas";
import { User } from "src/modules/users/schemas/user.schema";

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({ timestamps: true }) // biến class thành 1 schema // lấy time at
export class ChatRoom {
    @Prop({ type: String, required: true })
    roomName: string; // Tên của phòng chat, có thể là tên nhóm hoặc tên do người dùng đặt

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name, required: true })
    members: [mongoose.Schema.Types.ObjectId]; // Danh sách ID của các thành viên trong phòng

    @Prop({ type: Boolean, default: false })
    isGroup: boolean; // Xác định đây là phòng nhóm hay phòng cá nhân

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    admin: mongoose.Schema.Types.ObjectId; // Người quản trị nhóm, chỉ áp dụng với nhóm chat

    @Prop({ type: String, default: '' })
    groupAvatar: string; // Ảnh đại diện của nhóm (URL)

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
    messages: [mongoose.Schema.Types.ObjectId]; // Lưu trữ các tin nhắn trong nhóm (thường lưu message ID)

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
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);

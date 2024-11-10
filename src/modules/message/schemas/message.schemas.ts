import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { ChatRoom } from "src/modules/chat-rooms/schemas/chat-room.schemas";
import { User } from "src/modules/users/schemas/user.schema";

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true }) // biến class thành 1 schema // lấy time at
export class Message {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
    sender: mongoose.Schema.Types.ObjectId;  // ID của người gửi

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ChatRoom.name, required: true })
    chatRoom: mongoose.Schema.Types.ObjectId; // ID của phòng chat

    @Prop({ type: String, enum: ['text', 'file', 'call', 'notification'], required: true })
    messageType: string; // Loại tin nhắn

    @Prop({ type: String, default: '' })
    content: string; // Nội dung tin nhắn, có thể chứa cả văn bản và emoji

    @Prop({ type: [String] })
    fileUrl: [string]; // Đường dẫn của tệp, nếu có

    @Prop({ type: String, enum: ['voice', 'video'] })
    callType: string; // Loại cuộc gọi, nếu có

    @Prop({ type: Boolean, default: false })
    isMissedCall: boolean; // Xác định cuộc gọi có bị nhỡ không

    @Prop({ type: String, default: '' })
    notification: string; // Thông báo đặc biệt trong nhóm

    @Prop({ type: Boolean, default: false })
    isRead: boolean; // Đã đọc hay chưa

    @Prop({
        type: Object,
        of: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }]
    })
    reactions: Map<string, [mongoose.Schema.Types.ObjectId]>; // Lưu phản ứng, với key là emoji và value là danh sách user phản hồi

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
export const MessageSchema = SchemaFactory.createForClass(Message);

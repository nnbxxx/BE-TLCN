import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MESSAGE_TYPES } from 'src/constants/schema.enum';
import { ChatRoom } from 'src/modules/chat-rooms/schemas/chat-room.schemas';
import { User } from 'src/modules/users/schemas/user.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true }) // biến class thành 1 schema // lấy time at
export class Message {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        required: false,
        default: null,
    })
    sender: mongoose.Schema.Types.ObjectId; // ID của người gửi

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: ChatRoom.name,
        required: true,
    })
    chatRoom: mongoose.Schema.Types.ObjectId; // ID của phòng chat

    @Prop({ type: String, enum: MESSAGE_TYPES, required: true })
    messageType: string; // Loại tin nhắn

    @Prop({ type: String, default: '' })
    content: string; // Nội dung tin nhắn, có thể chứa cả văn bản và emoji

    @Prop({ type: [String], default: [] })
    fileUrl: [string]; // Đường dẫn của tệp, nếu có

    @Prop({ type: Boolean, default: false })
    isRead: boolean; // Đã đọc hay chưa

    @Prop({ type: Boolean, default: false })
    isSystem: boolean; // Loại tin nhắn gen tự động của hệ thống nếu true

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

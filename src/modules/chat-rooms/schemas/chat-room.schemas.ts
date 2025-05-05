import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Message } from 'src/modules/message/schemas/message.schemas';
import { User } from 'src/modules/users/schemas/user.schema';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({ timestamps: true }) // biến class thành 1 schema // lấy time at
export class ChatRoom {
    @Prop({ type: String, required: true, unique: true })
    roomKey: string;

    @Prop({ type: String, required: true })
    roomName: string; // Tên của phòng chat, có thể là tên nhóm hoặc tên do người dùng đặt

    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true,
    })
    members: [mongoose.Schema.Types.ObjectId]; // Danh sách ID của các thành viên trong phòng

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    })
    lastMessage: mongoose.Schema.Types.ObjectId; // ID của tin nhắn cuối cùng

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

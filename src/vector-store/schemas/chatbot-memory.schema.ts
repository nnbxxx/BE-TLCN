import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatbotMemoryDocument = ChatbotMemory & Document;

@Schema({ timestamps: true }) // tự động thêm createdAt/updatedAt nếu cần
export class ChatbotMemory {
    @Prop({ required: true, index: true })
    userId: string;

    @Prop({ required: true, index: true })
    conversationId: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: [Number] }) // embedding là mảng số
    embedding: number[];

}

export const ChatbotMemorySchema = SchemaFactory.createForClass(ChatbotMemory);

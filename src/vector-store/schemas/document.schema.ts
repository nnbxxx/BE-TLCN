import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document as MongooseDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Document extends MongooseDocument {
    @Prop({ required: true })
    filename: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    chunkCount: number;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VectorDocument' }], default: [] })
    vectorIds: Types.ObjectId[];
}

export const DocumentSchema = SchemaFactory.createForClass(Document);

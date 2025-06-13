import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

@Schema({ timestamps: true })
export class VectorDocument extends MongooseDocument {
    @Prop({ required: true })
    content: string;

    @Prop({ type: [Number], required: true }) // mảng số thực
    embedding: number[];

    @Prop({
        type: {
            filename: String,
            title: String,
        },
        required: true,
    })
    metadata: {
        filename: string;
        title: string;
    };

}

export const VectorSchema = SchemaFactory.createForClass(VectorDocument);

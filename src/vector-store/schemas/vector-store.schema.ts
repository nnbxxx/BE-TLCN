import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VectorDocument = Vector & Document;

@Schema()
export class Vector {
    @Prop({ required: true })
    text: string;

    @Prop({ required: true })
    source: string;

    @Prop({ type: [Number], required: true })
    embedding: number[];
}

export const VectorSchema = SchemaFactory.createForClass(Vector);

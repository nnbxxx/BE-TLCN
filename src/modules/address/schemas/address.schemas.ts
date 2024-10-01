import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type AddressDocument = HydratedDocument<Address>;
export class Wards {
    Id: string;
    Name: string;
    Level: string;
}
export class Districts {
    Id: string;
    Name: string;
    Wards: Wards[]

}
@Schema()
export class Address {
    @Prop({ type: String })
    Id: string;
    @Prop({ type: String })
    Name: string;
    @Prop({
        require: true, type: [{
            Id: { type: String },
            Name: { type: String },
            Wards: {
                type: [{
                    Id: { type: String },
                    Name: { type: String },
                    Level: { type: String },
                }]
            }

        }]
    })
    Districts: Districts[];

}
export const AddressSchema = SchemaFactory.createForClass(Address);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { PAYMENT_METHOD, RECEIPT_STATUS } from "src/constants/schema.enum";
import { Product } from "src/modules/products/schemas/product.schemas";
import { User } from "src/modules/users/schemas/user.schema";
import { AddressReceipt, ReceiptItem } from "../dto/update-receipt.dto";
import { Color } from "src/color/schemas/color.schemas";
import { AddressUser } from "src/modules/address-user/schemas/address-user.schemas";

export type ReceiptDocument = HydratedDocument<Receipt>;
@Schema({ timestamps: true })
export class Receipt {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: AddressUser.name })
  address: mongoose.Schema.Types.ObjectId;

  @Prop({
    require: true,
    type: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: Product.name, require: true, },
      quantity: { type: Number, require: true, },
      price: { type: Number, require: true, },
      color: { type: String },
      size: { type: String },
    }]
  })
  items: ReceiptItem[];
  @Prop({
    default: [],
    type: [String]
  })
  coupons: string[];
  // nhà cung cấp 
  @Prop({ required: true })
  supplier: string;
  // giá tiền
  @Prop({ type: Number, default: 0 })
  total: number;

  @Prop({ required: false })
  notes: string;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

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
  @Prop({ type: String, enum: RECEIPT_STATUS, default: RECEIPT_STATUS.UNCONFIRMED, required: true })
  statusUser: RECEIPT_STATUS;

  @Prop({ type: String, enum: RECEIPT_STATUS, default: RECEIPT_STATUS.UNCONFIRMED, required: true })
  statusSupplier: RECEIPT_STATUS;
  @Prop({ type: String, enum: PAYMENT_METHOD, default: PAYMENT_METHOD.COD, required: true })
  paymentMethod: PAYMENT_METHOD;

  @Prop({ type: Boolean, default: false })
  isCheckout: boolean

  @Prop()
  createdAt: Date;

  @Prop()
  confirmationDate: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}
export const ReceiptSchema = SchemaFactory.createForClass(Receipt);
/*
{
  "items": [
    {
      "product": "66f3d74a9a0b38cea549a180",
      "name": "dior 1",
      "price": 123450,
      "quantity": 5
    }
  ],
  "supplier": "abc 1",
  "notes": "abcdefgh",
  "address": {
    "province": "Hà Nội",
    "district": "Quận Ba Đình",
    "ward": "Phường Trúc Bạch",
    "detail": "45/2/1 abc xyz"
  }
}
*/
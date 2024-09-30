import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateCartDto {
    // @IsMongoId({ message: "user phải là mongo id" })
    // @IsNotEmpty({ message: 'user không được để trống', })
    // user: mongoose.Schema.Types.ObjectId;
}

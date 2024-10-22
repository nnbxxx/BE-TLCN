import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateNotificationDto {
    @ApiProperty({ example: '66fa38a7f037dc5950953765', description: 'userId' })
    @IsMongoId({ message: "Category phải là mongo id" })
    @IsNotEmpty({ message: 'Category sản phẩm không được để trống', })
    userId: mongoose.Schema.Types.ObjectId;

    @ApiProperty({ example: 'thông báo abc xyz', description: 'title' })
    @IsNotEmpty({ message: 'Title không được để trống', })
    title: string;

    @ApiProperty({ example: 'tin nhắn abc xyz abc xyz', description: 'message' })
    @IsNotEmpty({ message: 'Message không được để trống', })
    message: string;
}

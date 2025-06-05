import {
    IsArray,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { MESSAGE_TYPES } from 'src/constants/schema.enum';

export class CreateMessageDto {
    @IsString()
    @IsOptional()
    content: string;

    @IsString()
    @IsMongoId()
    chatRoom: string;

    @IsArray()
    @IsOptional()
    fileUrl: string[];

    @IsEnum(MESSAGE_TYPES)
    messageType: string;

    @IsNumber()
    @IsOptional()
    questionId: number;
}

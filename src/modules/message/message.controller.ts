import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    UnprocessableEntityException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResponseMessage, User } from 'src/decorator/customize';
import { CreateMessageDto } from 'src/modules/message/dto/create-message.dto';
import { MessageService } from 'src/modules/message/message.service';
import { IUser } from 'src/modules/users/users.interface';

@ApiTags('message')
@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post()
    @ResponseMessage('Create message success')
    create(@User() user: IUser, @Body() createMessageDto: CreateMessageDto) {
        return this.messageService.create(user, createMessageDto);
    }

    @Get()
    @ResponseMessage('List all messages success')
    findAll(
        @User() user: IUser,
        @Query('chatRoom') chatRoom: string,
        @Query('currentPage') currentPage: number,
        @Query('limit') limit: number,
    ) {
        if (!chatRoom) {
            throw new UnprocessableEntityException('chatRoom is required');
        }

        return this.messageService.findAll(user, {
            chatRoom,
            currentPage,
            limit,
        });
    }
}

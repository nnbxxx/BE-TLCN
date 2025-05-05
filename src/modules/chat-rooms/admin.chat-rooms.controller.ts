import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IUser } from 'src/modules/users/users.interface';
import { ChatRoomsService } from './chat-rooms.service';
import {
    Roles,
    RolesGuard,
    USER_BASE_ROLES,
} from 'src/auth/passport/role.guard';
import { ResponseMessage, User } from 'src/decorator/customize';

@ApiTags('chat-rooms')
@Controller('admin/chat-rooms')
@UseGuards(RolesGuard)
@Roles(USER_BASE_ROLES.ADMIN)
export class AdminChatRoomsController {
    constructor(private readonly ChatRoomsService: ChatRoomsService) {}

    @Get()
    @ResponseMessage('List all rooms success')
    findAll(
        @Query('currentPage') currentPage: number,
        @Query('limit') limit: number,
    ) {
        return this.ChatRoomsService.findAll({ currentPage, limit });
    }

    @Post(':id/join')
    @ResponseMessage('Join room success')
    joinRoom(@User() user: IUser, @Param('id') id: string) {
        return this.ChatRoomsService.joinRoom(user, id);
    }
}

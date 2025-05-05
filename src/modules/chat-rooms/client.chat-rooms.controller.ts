import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
    Roles,
    RolesGuard,
    USER_BASE_ROLES,
} from 'src/auth/passport/role.guard';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/modules/users/users.interface';
import { ChatRoomsService } from './chat-rooms.service';

@ApiTags('chat-rooms')
@Controller('client/chat-rooms')
@UseGuards(RolesGuard)
@Roles(USER_BASE_ROLES.USER)
export class ClientChatRoomsController {
    constructor(private readonly ChatRoomsService: ChatRoomsService) {}

    @Get()
    clientGetChatRoom(@User() user: IUser) {
        return this.ChatRoomsService.clientGetChatRoom(user);
    }
}

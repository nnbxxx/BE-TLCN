import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatRoomsService } from 'src/modules/chat-rooms/chat-rooms.service';
import { AdminChatRoomsController } from 'src/modules/chat-rooms/admin.chat-rooms.controller';
import { ClientChatRoomsController } from 'src/modules/chat-rooms/client.chat-rooms.controller';
import {
    ChatRoom,
    ChatRoomSchema,
} from 'src/modules/chat-rooms/schemas/chat-room.schemas';
import {
    Message,
    MessageSchema,
} from 'src/modules/message/schemas/message.schemas';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ChatRoom.name, schema: ChatRoomSchema },
            { name: Message.name, schema: MessageSchema },
        ]),
    ],
    controllers: [AdminChatRoomsController, ClientChatRoomsController],
    providers: [ChatRoomsService],
    exports: [ChatRoomsService],
})
export class ChatRoomsModule {}

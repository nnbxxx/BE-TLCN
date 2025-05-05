import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schemas';
import {
    ChatRoom,
    ChatRoomSchema,
} from 'src/modules/chat-rooms/schemas/chat-room.schemas';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema },
            { name: ChatRoom.name, schema: ChatRoomSchema },
        ]),
        GatewayModule,
    ],
    controllers: [MessageController],
    providers: [MessageService],
    exports: [MessageService],
})
export class MessageModule {}

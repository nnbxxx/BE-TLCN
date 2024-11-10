import { Module } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatRoomsController } from './chat-rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from './schemas/chat-room.schemas';


@Module({
  imports: [MongooseModule.forFeature([{ name: ChatRoom.name, schema: ChatRoomSchema }]),],
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService],
  exports: [ChatRoomsService]
})
export class ChatRoomsModule { }

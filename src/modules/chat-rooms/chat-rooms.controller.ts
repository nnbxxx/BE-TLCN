import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('chat-rooms')
@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly ChatRoomsService: ChatRoomsService) { }

  @Post()
  create(@Body() createChatRoomDto: CreateChatRoomDto) {
    return this.ChatRoomsService.create(createChatRoomDto);
  }

  @Get()
  findAll() {
    return this.ChatRoomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ChatRoomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatRoomDto: UpdateChatRoomDto) {
    return this.ChatRoomsService.update(+id, updateChatRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ChatRoomsService.remove(+id);
  }
}

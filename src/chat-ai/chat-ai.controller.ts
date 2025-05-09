import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ChatAiService } from './chat-ai.service';
import { CreateChatAiDto } from './dto/create-chat-ai.dto';
import { UpdateChatAiDto } from './dto/update-chat-ai.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import multer from 'multer';
@ApiTags('chat-ai')
@Controller('chat-ai')
export class ChatAiController {
  constructor(private readonly chatAiService: ChatAiService) { }

  // @Post()
  // create(@Body() createChatAiDto: CreateChatAiDto) {
  //   return this.chatAiService.create(createChatAiDto);
  // }

  // @Get()
  // findAll() {
  //   return this.chatAiService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.chatAiService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateChatAiDto: UpdateChatAiDto) {
  //   return this.chatAiService.update(+id, updateChatAiDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.chatAiService.remove(+id);
  // }
  @Post()
  @ApiOperation({ summary: 'Gửi câu hỏi đến AI và nhận phản hồi' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Sản phẩm có bảo hành không?' },
      },
    },
  })
  async ask(@Body('message') message: string) {
    const reply = await this.chatAiService.askAI(message);
    return { reply };
  }
  @Post('image')
  @ApiOperation({ summary: 'Upload ảnh để hỏi AI' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', {
    storage: multer.memoryStorage(),
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log("🚀 ~ ChatAiController ~ uploadImage ~ file:", file)
    const buffer = file.buffer;
    const base64Image = buffer.toString('base64');

    const result = await this.chatAiService.askWithImage(base64Image);
    return { reply: result };
  }
}

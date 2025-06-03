import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ChatAiService } from './chat-ai.service';
import { CreateChatAiDto } from './dto/create-chat-ai.dto';
import { UpdateChatAiDto } from './dto/update-chat-ai.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorator/customize';
import { InteractiveAgentService } from './ultils/interactive-agent.service';
@ApiTags('chat-ai')
@Controller('chat-ai')
export class ChatAiController {
  constructor(private readonly chatAiService: ChatAiService,
    private readonly interactiveAgentService: InteractiveAgentService,
  ) { }
  @Public()
  @Get('interact')
  async interactWithAgent(@Query('question') question: string) {
    if (!question?.trim()) {
      throw new BadRequestException('Query parameter "question" cannot be empty.');
    }
    try {
      const answer = await this.interactiveAgentService.interact(question);
      return { question, answer, timestamp: new Date().toISOString() };
    } catch (error) {
      throw new InternalServerErrorException(`Lỗi xử lý yêu cầu: ${error.message}`);
    }
  }
  @Public()
  @Get('ask')
  async askTheAgent(@Query('question') question: string) {
    if (question?.trim() === '') {
      throw new BadRequestException('Query parameter "question" cannot be empty.');
    }

    try {
      const answer = await this.chatAiService.ask(question);
      return {
        question: question,
        answer: answer,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error interacting with AI Agent:', error);
      throw new InternalServerErrorException(`Sorry, an error occurred while processing your request. Please try again later.`);
    }
  }
}

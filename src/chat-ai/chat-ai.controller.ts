import {
  Controller,
  Get,
  Post,
  Query,
  BadRequestException,
  InternalServerErrorException,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as pdfParse from 'pdf-parse';
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai';
import { VectorStoreService } from 'src/vector-store/vector-store.service';
import { InteractiveAgentService } from './ultils/interactive-agent.service';
import { Public } from 'src/decorator/customize';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('chat-ai')
@Controller('chat-ai')
export class ChatAiController {
  private readonly uploadDir = path.join(__dirname, '..', '..', 'uploads');

  private embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  constructor(
    private readonly vectorStoreService: VectorStoreService,
    private readonly interactiveAgentService: InteractiveAgentService,
  ) {
    fs.mkdir(this.uploadDir, { recursive: true }).catch(console.error);
  }


  @Public()
  @Get('interact')
  @ApiOperation({ summary: 'Gửi câu hỏi tới Chat AI và nhận câu trả lời' })
  @ApiQuery({ name: 'question', required: true, description: 'Câu hỏi' })
  @ApiResponse({ status: 200, description: 'Câu trả lời từ Chat AI' })
  @ApiResponse({ status: 400, description: 'Query parameter không hợp lệ' })
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




}

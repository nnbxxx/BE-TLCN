import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateChatAiDto } from './dto/create-chat-ai.dto';
import { UpdateChatAiDto } from './dto/update-chat-ai.dto';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class ChatAiService {
  private readonly OLLAMA_URL = 'http://localhost:11434/api/generate';
  private readonly MODEL = 'gemma3:1b'; // Hoặc mistral, llama3, gemma:2b,...

  // Gọi mô hình để xử lý câu hỏi text
  async askAI(userMessage: string): Promise<string> {
    const prompt = `
    Bạn là trợ lý bán hàng. Hãy trả lời bằng tiếng Việt rõ ràng:

    "${userMessage}"
    `;

    try {
      const response = await axios.post(this.OLLAMA_URL, {
        model: this.MODEL,
        prompt: prompt,
        stream: false,
      });

      return response.data.response || 'Không có phản hồi.';
    } catch (error) {
      console.error('Ollama API error:', error.message);
      throw new Error('Chat API lỗi: ' + error.message);
    }
  }



  create(createChatAiDto: CreateChatAiDto) {
    return 'This action adds a new chatAi';
  }

  findAll() {
    return 'This action returns all chatAi';
  }

  findOne(id: number) {
    return `This action returns a #${id} chatAi`;
  }

  update(id: number, updateChatAiDto: UpdateChatAiDto) {
    return `This action updates a #${id} chatAi`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatAi`;
  }
}

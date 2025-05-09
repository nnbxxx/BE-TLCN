import { Injectable } from '@nestjs/common';
import { CreateChatAiDto } from './dto/create-chat-ai.dto';
import { UpdateChatAiDto } from './dto/update-chat-ai.dto';
import OpenAI from 'openai'; // Import thư viện OpenAI

@Injectable()
export class ChatAiService {
  private openai: OpenAI;

  constructor() {
    // Khởi tạo OpenAI client với cấu hình cần thiết
    this.openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1', // URL của OpenRouter API
      apiKey: process.env.OPENROUTER_API_KEY, // Lấy API key từ biến môi trường
      defaultHeaders: {
        'HTTP-Referer': 'https://www.sitename.com', // URL của site bạn
        'X-Title': 'SiteName', // Tên của site bạn
      },
    });
  }

  // Hàm tạo mới (Chưa sử dụng trong ví dụ)
  create(createChatAiDto: CreateChatAiDto) {
    return 'This action adds a new chatAi';
  }

  // Hàm lấy tất cả (Chưa sử dụng trong ví dụ)
  findAll() {
    return 'This action returns all chatAi';
  }

  // Hàm lấy một (Chưa sử dụng trong ví dụ)
  findOne(id: number) {
    return `This action returns a #${id} chatAi`;
  }

  // Hàm cập nhật (Chưa sử dụng trong ví dụ)
  update(id: number, updateChatAiDto: UpdateChatAiDto) {
    return `This action updates a #${id} chatAi`;
  }

  // Hàm xóa (Chưa sử dụng trong ví dụ)
  remove(id: number) {
    return `This action removes a #${id} chatAi`;
  }

  // Hàm gọi OpenAI API để trả lời câu hỏi từ người dùng
  async askAI(userMessage: string): Promise<string> {
    const prompt = `
      Bạn là trợ lý bán hàng. Hãy trả lời câu hỏi sau bằng tiếng Việt rõ ràng, ngắn gọn:

      "${userMessage}"
    `;

    try {
      // Gọi OpenAI API để nhận phản hồi từ mô hình
      const completion = await this.openai.chat.completions.create({
        model: 'qwen/qwen3-4b:free', // Bạn có thể thay đổi model tại đây
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return completion.choices?.[0]?.message?.content || 'No response.';
    } catch (error) {
      console.error('OpenAI API error:', error.message);
      throw new Error('Chat API error: ' + error.message);
    }
  }
  async askWithImage(base64Image: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'qwen/qwen3-4b:free', // Bạn có thể thay đổi model tại đây
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Hãy mô tả nội dung của bức ảnh sau:',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
      });

      return completion.choices?.[0]?.message?.content || 'No response.';
    } catch (error) {
      console.error('Image Chat API error:', error.message);
      throw new Error('Failed to process image');
    }
  }
}

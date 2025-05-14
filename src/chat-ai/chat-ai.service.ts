import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { CreateChatAiDto } from './dto/create-chat-ai.dto';
import { UpdateChatAiDto } from './dto/update-chat-ai.dto';
import { Product } from 'src/modules/products/schemas/product.schemas';

@Injectable()
export class ChatAiService {
  private readonly OLLAMA_URL: string;
  private readonly MODEL: string;
  private readonly BASE_URL: string = 'http://localhost:3000/product'; // URL cơ sở cho sản phẩm

  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {
    this.OLLAMA_URL = process.env.OLLAMA_URL;
    this.MODEL = process.env.MODEL;

    if (!this.OLLAMA_URL || !this.MODEL) {
      throw new Error('OLLAMA_URL hoặc MODEL không được cấu hình trong biến môi trường.');
    }
  }

  // Ánh xạ cân nặng và chiều cao sang kích thước
  private getSizeFromWeightAndHeight(weight: number, height: number): string | null {
    if (weight >= 40 && weight <= 50 && height >= 150 && height <= 160) return 'S';
    if (weight >= 50 && weight <= 60 && height >= 155 && height <= 165) return 'M';
    if (weight >= 60 && weight <= 70 && height >= 160 && height <= 170) return 'L';
    if (weight >= 70 && weight <= 80 && height >= 165 && height <= 175) return 'XL';
    return null;
  }

  // Phân tích câu hỏi của người dùng
  private parseUserQuery(message: string): {
    color?: string;
    size?: string;
    material?: string;
    occasion?: string;
    category?: string;
    tag?: string;
    weight?: number;
    height?: number;
    productCode?: string;
  } {
    const query: any = {};
    const lowerMessage = message.toLowerCase();

    // Màu sắc
    if (lowerMessage.includes('đỏ')) query.color = '#ef0505';
    if (lowerMessage.includes('tím')) query.color = '#7636d8';
    if (lowerMessage.includes('xanh ngọc') || lowerMessage.includes('xanh')) query.color = '#7df2f0';
    if (lowerMessage.includes('vàng')) query.color = '#f8da92';

    // Kích thước
    if (lowerMessage.includes('size s') || lowerMessage.includes('nhỏ')) query.size = 'S';
    if (lowerMessage.includes('size m') || lowerMessage.includes('vừa')) query.size = 'M';
    if (lowerMessage.includes('size l') || lowerMessage.includes('lớn')) query.size = 'L';
    if (lowerMessage.includes('size xl') || lowerMessage.includes('rất lớn')) query.size = 'XL';

    // Chất liệu
    if (lowerMessage.includes('tơ sống')) query.material = 'tơ sống';
    if (lowerMessage.includes('sa hàn')) query.material = 'sa hàn';
    if (lowerMessage.includes('tơ hoa cúc')) query.material = 'tơ hoa cúc';
    if (lowerMessage.includes('lụa') || lowerMessage.includes('tơ tằm')) query.material = 'lụa';
    if (lowerMessage.includes('habutai')) query.material = 'habutai';

    // Dịp sử dụng
    if (lowerMessage.includes('cưới') || lowerMessage.includes('hôn lễ')) query.occasion = 'cưới';
    if (lowerMessage.includes('lễ') || lowerMessage.includes('sự kiện')) query.occasion = 'lễ trọng đại';

    // Danh mục
    if (lowerMessage.includes('giao lĩnh')) query.category = 'Áo Giao Lĩnh';
    if (lowerMessage.includes('tứ thân')) query.category = 'Áo Tứ Thân';
    if (lowerMessage.includes('áo dài')) query.category = 'Áo Dài';

    // Thẻ
    if (lowerMessage.includes('đặc biệt') || lowerMessage.includes('special')) query.tag = 'special';
    if (lowerMessage.includes('truyền thống')) query.tag = 'traditional';

    // Cân nặng và chiều cao
    const weightMatch = lowerMessage.match(/(\d+)\s*(kg|kilo)/i);
    const heightMatch = lowerMessage.match(/(\d+)\s*(cm|centimet)/i);
    if (weightMatch) query.weight = parseInt(weightMatch[1]);
    if (heightMatch) query.height = parseInt(heightMatch[1]);

    // Nếu có cân nặng và chiều cao, xác định kích thước
    if (query.weight && query.height && !query.size) {
      query.size = this.getSizeFromWeightAndHeight(query.weight, query.height);
    }

    // Mã sản phẩm
    const codeMatch = lowerMessage.match(/(mã|code)\s*(SAC\d+)/i);
    if (codeMatch) query.productCode = codeMatch[2];

    return query;
  }

  // Truy vấn sản phẩm dựa trên tiêu chí
  private async findProductsByQuery(query: {
    color?: string;
    size?: string;
    material?: string;
    occasion?: string;
    category?: string;
    tag?: string;
    productCode?: string;
  }): Promise<Product[]> {
    const filter: any = {};
    if (query.color) filter['variants.attributes.color.name'] = query.color;
    if (query.size) filter['variants.attributes.size.name'] = query.size;
    if (query.material) filter['description'] = { $regex: query.material, $options: 'i' };
    if (query.occasion) filter['description'] = { $regex: query.occasion, $options: 'i' };
    if (query.category) filter['name'] = { $regex: query.category, $options: 'i' };
    if (query.tag) filter['tags'] = query.tag;
    if (query.productCode) filter.code = query.productCode;

    return this.productModel.find(filter).limit(3).exec();
  }

  // Tính điểm khớp để sắp xếp sản phẩm
  private calculateMatchScore(product: Product, query: any): number {
    let score = 0;
    if (query.color && product.variants.some((v) => v.attributes.color.name === query.color)) score += 2;
    if (query.size && product.variants.some((v) => v.attributes.size.name === query.size)) score += 2;
    if (query.material && product.description.toLowerCase().includes(query.material)) score += 1;
    if (query.occasion && product.description.toLowerCase().includes(query.occasion)) score += 1;
    if (query.category && product.name.toLowerCase().includes(query.category.toLowerCase())) score += 1;
    if (query.tag && product.tags.includes(query.tag)) score += 1;
    if (query.productCode && product.code === query.productCode) score += 3;
    return score;
  }

  // Gọi mô hình để xử lý câu hỏi
  async askAI(userMessage: string): Promise<string> {
    if (!userMessage || typeof userMessage !== 'string') {
      throw new Error('Câu hỏi không hợp lệ.');
    }

    // Làm sạch đầu vào
    const cleanMessage = userMessage.replace(/[<>{}]/g, '');

    // Phân tích câu hỏi
    const query = this.parseUserQuery(cleanMessage);

    // Tìm sản phẩm phù hợp
    let products = await this.findProductsByQuery(query);

    // Sắp xếp sản phẩm theo độ khớp
    products = products.sort((a, b) => this.calculateMatchScore(b, query) - this.calculateMatchScore(a, query));

    // Tạo chuỗi mô tả sản phẩm
    let productDetails = '';
    if (products.length > 0) {
      productDetails = products
        .slice(0, 2)
        .map((p: any) => {
          const variants = p.variants
            .filter(
              (v) =>
                (!query.color || v.attributes.color.name === query.color) &&
                (!query.size || v.attributes.size.name === query.size)
            )
            .map((v) => `Màu: ${v.attributes.color.name}, Size: ${v.attributes.size.name}`)
            .join('; ');
          const productLink = `<a href="${this.BASE_URL}/${p._id}">Xem chi tiết</a>`;
          return `Tên: ${p.name}, Mã: ${p.code}, Mô tả: ${p.description.replace(/<[^>]+>/g, '')}, Biến thể: ${variants}, Link: ${productLink}`;
        })
        .join('\n');
    } else {
      productDetails = 'Không tìm thấy sản phẩm phù hợp.';
    }

    // Tạo prompt
    const prompt = `
Bạn là một trợ lý bán hàng cho website bán quần áo thời trang truyền thống. Hãy trả lời ngắn gọn, lịch sự, rõ ràng bằng tiếng Việt.

- Dựa trên danh sách sản phẩm dưới đây, gợi ý **một hoặc hai sản phẩm phù hợp nhất** với yêu cầu của khách, bao gồm đường dẫn HTML (<a href="...">Xem chi tiết</a>).
- Nếu có nhiều sản phẩm phù hợp, ưu tiên sản phẩm có mô tả hoặc biến thể khớp chính xác nhất với yêu cầu.
- Nếu không có sản phẩm phù hợp, xin lỗi và đề nghị khách liên hệ nhân viên.
- Đảm bảo giữ nguyên định dạng HTML của đường dẫn trong phản hồi.
- Nếu khách hỏi về giá, xin lỗi và đề nghị liên hệ nhân viên vì thông tin giá không có sẵn.

**Câu hỏi từ khách**: "${cleanMessage}"
**Danh sách sản phẩm**:
${productDetails}
`;

    try {
      const response = await axios.post(this.OLLAMA_URL, {
        model: this.MODEL,
        prompt: prompt,
        stream: false,
      });

      const answer = response.data.response?.trim() || 'Không có phản hồi.';
      console.log(`User query: ${cleanMessage}, Response: ${answer}`);
      return answer;
    } catch (error) {
      console.error('Ollama API error:', error.message);
      throw new Error('Không thể xử lý yêu cầu. Vui lòng thử lại sau.');
    }
  }

  // Các phương thức CRUD
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
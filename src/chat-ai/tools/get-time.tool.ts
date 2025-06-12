import { Injectable } from '@nestjs/common';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

@Injectable()
export class GetTimeTool extends DynamicStructuredTool {
    constructor() {
        super({
            name: 'get_current_time',
            description:
                'Rất hữu ích khi bạn cần biết thời gian hiện tại. Chỉ dùng khi người dùng hỏi cụ thể về "mấy giờ rồi", "giờ hiện tại", "thời gian bây giờ".',
            schema: z.object({}),
            func: async () => {
                try {
                    const now = new Date();
                    return `Bây giờ là ${now.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })}`;
                } catch (error) {
                    return 'Xin lỗi, tôi không thể lấy được thời gian hiện tại.';
                }
            },
        });
    }
}

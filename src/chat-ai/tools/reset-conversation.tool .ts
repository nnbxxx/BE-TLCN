// src/tools/reset-conversation.tool.ts
import { Injectable } from '@nestjs/common';
import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { BufferMemory } from 'langchain/memory';
// reset-conversation.tool.ts
@Injectable()
export class ResetConversationTool extends DynamicStructuredTool {
    name = 'reset_conversation';
    description = 'Xóa toàn bộ lịch sử cuộc hội thoại.';

    private memory: BufferMemory;

    setMemory(memory: BufferMemory) {
        this.memory = memory;
    }

    constructor() {
        super({
            name: 'reset_conversation',
            description: 'Reset lại cuộc hội thoại ngay lập tức mà không cần xác nhận.',
            schema: z.object({}),
            func: async () => {
                if (!this.memory) return 'Không thể reset: memory chưa được khởi tạo.';
                await this.memory.clear();
                return 'Đã reset lại cuộc hội thoại. Bạn có thể bắt đầu cuộc trò chuyện mới.';
            },
        });
    }
}

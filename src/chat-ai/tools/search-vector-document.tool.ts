// src/tools/search-vector-document.tool.ts
import { z } from 'zod';
import { Injectable } from '@nestjs/common';
import { DynamicStructuredTool } from 'langchain/tools';
import { VectorStoreService } from 'src/vector-store/vector-store.service';

@Injectable()
export class SearchVectorDocumentTool extends DynamicStructuredTool {
    name = 'search_vector_document';
    description = 'Tìm kiếm các tài liệu đã lưu trong hệ thống để hỗ trợ trả lời câu hỏi người dùng. (RAG) ';

    constructor(private readonly vectorStoreService: VectorStoreService) {
        super({
            name: 'search_vector_document',
            description: 'Tìm kiếm các đoạn văn bản từ tài liệu PDF đã lưu có liên quan đến truy vấn.',
            schema: z.object({
                query: z.string().describe('Câu hỏi của người dùng cần tìm kiếm trong tài liệu'),
            }),
            func: async ({ query }) => {
                const results = await this.vectorStoreService.searchSimilarDocuments(query, 3);

                if (!results || results.length === 0 || results[0].similarity < 0.75) {
                    return 'Không tìm thấy tài liệu phù hợp.';
                }

                const combined = results
                    .map((r, i) => `Kết quả ${i + 1} (từ "${r.metadata.title}"):\n${r.content}`)
                    .join('\n---\n');

                return `Dưới đây là nội dung liên quan từ tài liệu:\n\n${combined}`;
            },
        });
    }
}

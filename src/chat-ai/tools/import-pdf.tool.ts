import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as pdfParse from 'pdf-parse';

export const ImportPDFTool = new DynamicStructuredTool({
    name: 'import_pdf_tool',
    description: 'Dùng để đọc nội dung file PDF. Sử dụng khi người dùng yêu cầu tóm tắt hoặc đọc nội dung file PDF cụ thể.',
    schema: z.object({
        filePath: z.string().describe('Đường dẫn đến file PDF'),
    }),
    func: async ({ filePath }) => {
        try {
            const buffer = await fs.readFile(filePath);
            const data = await pdfParse(buffer);
            return `Đã đọc PDF. Nội dung:\n${data.text.slice(0, 1500)}...`;
        } catch (err) {
            return 'Không thể đọc PDF. Hãy kiểm tra lại file.';
        }
    },
});

import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

export const GetTimeTool = new DynamicStructuredTool({
    name: 'get_current_time',
    description: 'Rất hữu ích khi bạn cần biết thời gian hiện tại. Chỉ dùng khi người dùng hỏi cụ thể về "mấy giờ rồi", "giờ hiện tại", "thời gian bây giờ".',
    schema: z.object({
        // Tool này không cần input, nhưng schema vẫn cần được định nghĩa (có thể là object rỗng)
        // timezone: z.string().optional().describe("Múi giờ, ví dụ: Asia/Ho_Chi_Minh. Mặc định là giờ server nếu không cung cấp."),
    }),
    func: async ({ /*timezone*/ }) => { // Tham số timezone nếu có
        try {
            const now = new Date();
            return `Bây giờ là ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
        } catch (error) {
            return "Xin lỗi, tôi không thể lấy được thời gian hiện tại.";
        }
    },
});

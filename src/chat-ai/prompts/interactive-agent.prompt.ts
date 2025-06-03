import {
    ChatPromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
} from '@langchain/core/prompts';

export const interactiveAgentPromptTemplate = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `Bạn là một trợ lý AI siêu thông minh và rất chuyên nghiệp. Nhiệm vụ của bạn là hỗ trợ người dùng một cách tốt nhất có thể. Hãy luôn trả lời một cách rõ ràng, ngắn gọn và súc tích. Nếu bạn cần dùng công cụ, hãy suy nghĩ cẩn thận..
Bạn có thể sử dụng các công cụ sau để hỗ trợ người dùng:

{tool_names}

Chi tiết từng công cụ:
{tools}`
    ),
    new MessagesPlaceholder('chat_history'),
    ['human', 'Câu hỏi của người dùng: {input} \n\n {agent_scratchpad}'],
]);

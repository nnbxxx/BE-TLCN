import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
import { BufferMemory } from 'langchain/memory';
import { AgentExecutor, createStructuredChatAgent } from 'langchain/agents';
import { interactiveAgentPromptTemplate } from '../prompts/interactive-agent.prompt';
import { GetTimeTool } from '../tools/get-time.tool';

@Injectable()
export class InteractiveAgentService implements OnModuleInit {
    private agentExecutor: AgentExecutor;
    private memory: BufferMemory;

    constructor(
        @Inject('GEMINI_CHAT_MODEL') private readonly llm: BaseChatModel,

    ) {

    }
    async onModuleInit() {
        this.memory = new BufferMemory({
            returnMessages: true,
            memoryKey: 'chat_history',
            inputKey: 'input',
            outputKey: 'output',
        });
        const prompt = interactiveAgentPromptTemplate;

        const tools = [GetTimeTool]; // Thêm GetTimeTool vào danh sách

        const agent = await createStructuredChatAgent({
            llm: this.llm,
            tools, // Truyền tools vào agent
            prompt,
        });

        this.agentExecutor = new AgentExecutor({
            agent,
            tools, // AgentExecutor cũng cần biết về tools để thực thi chúng
            memory: this.memory,
            verbose: true,
            handleParsingErrors: true,
        });
    }

    async interact(userInput: string): Promise<string> {
        console.log('User input:', userInput);
        const response = await this.agentExecutor.invoke({
            input: userInput,
        });
        return response.output;
    }
}

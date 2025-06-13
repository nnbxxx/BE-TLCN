import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { BufferMemory } from 'langchain/memory';
import { AgentExecutor, createStructuredChatAgent } from 'langchain/agents';
import { interactiveAgentPromptTemplate } from '../prompts/interactive-agent.prompt';
import { GetTimeTool } from '../tools/get-time.tool';
import { SearchProductTool } from '../tools/search-product.tool';
import { SearchVectorDocumentTool } from '../tools/search-vector-document.tool';

@Injectable()
export class InteractiveAgentService implements OnModuleInit {
    private agentExecutor: AgentExecutor;
    private memory: BufferMemory;

    constructor(
        @Inject('GEMINI_CHAT_MODEL')
        private readonly llm: BaseChatModel,

        private readonly getTimeTool: GetTimeTool,
        private readonly searchProductTool: SearchProductTool,
        private readonly searchVectorDocumentTool: SearchVectorDocumentTool, // 🆕
    ) { }

    async onModuleInit() {
        this.memory = new BufferMemory({
            returnMessages: true,
            memoryKey: 'chat_history',
            inputKey: 'input',
            outputKey: 'output',
        });

        const prompt = interactiveAgentPromptTemplate;

        const tools = [this.getTimeTool, this.searchProductTool, this.searchVectorDocumentTool];

        const agent = await createStructuredChatAgent({
            llm: this.llm,
            tools,
            prompt,
        });

        this.agentExecutor = new AgentExecutor({
            agent,
            tools,
            memory: this.memory,
            verbose: true,
            handleParsingErrors: true,
        });
    }

    async interact(userInput: string): Promise<string> {
        // console.log('User input:', userInput);
        const response = await this.agentExecutor.invoke({
            input: userInput,
        });
        return response.output;
    }
}

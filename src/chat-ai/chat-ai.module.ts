import { Module } from '@nestjs/common';
import { ChatAiService } from './chat-ai.service';
import { ChatAiController } from './chat-ai.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/modules/products/schemas/product.schemas';
import { GeminiChatProvider } from './chat-ai.provider';
import { InteractiveAgentService } from './ultils/interactive-agent.service';
import { VectorStoreModule } from 'src/vector-store/vector-store.module';
import { Vector, VectorSchema } from 'src/vector-store/schemas/vector-store.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }, { name: Vector.name, schema: VectorSchema }]),

    VectorStoreModule
  ],
  controllers: [ChatAiController],
  providers: [ChatAiService, GeminiChatProvider, InteractiveAgentService],
  exports: [ChatAiService, GeminiChatProvider]
})
export class ChatAiModule { }

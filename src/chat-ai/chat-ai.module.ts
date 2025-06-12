import { Module } from '@nestjs/common';
import { ChatAiController } from './chat-ai.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/modules/products/schemas/product.schemas';
import { GeminiChatProvider } from './chat-ai.provider';
import { InteractiveAgentService } from './ultils/interactive-agent.service';
import { VectorStoreModule } from 'src/vector-store/vector-store.module';
import { Vector, VectorSchema } from 'src/vector-store/schemas/vector-store.schema';
import { InventoryProduct, InventoryProductSchema } from 'src/modules/inventory-product/schemas/inventory-product.schemas';
import { GetTimeTool } from './tools/get-time.tool';
import { SearchProductTool } from './tools/search-product.tool';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Vector.name, schema: VectorSchema },
      { name: InventoryProduct.name, schema: InventoryProductSchema }
    ]),
    VectorStoreModule,
  ],
  controllers: [ChatAiController],
  providers: [
    GeminiChatProvider,
    InteractiveAgentService,
    GetTimeTool,                // ✅ Thêm vào đây
    SearchProductTool,          // ✅ Thêm vào đây
  ],
  exports: [
    GeminiChatProvider,
    InteractiveAgentService
  ]
})
export class ChatAiModule { }

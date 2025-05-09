import { Test, TestingModule } from '@nestjs/testing';
import { ChatAiController } from './chat-ai.controller';
import { ChatAiService } from './chat-ai.service';

describe('ChatAiController', () => {
  let controller: ChatAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatAiController],
      providers: [ChatAiService],
    }).compile();

    controller = module.get<ChatAiController>(ChatAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

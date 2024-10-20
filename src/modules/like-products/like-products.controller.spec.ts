import { Test, TestingModule } from '@nestjs/testing';
import { LikeProductsController } from './like-products.controller';
import { LikeProductsService } from './like-products.service';

describe('LikeProductsController', () => {
  let controller: LikeProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikeProductsController],
      providers: [LikeProductsService],
    }).compile();

    controller = module.get<LikeProductsController>(LikeProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

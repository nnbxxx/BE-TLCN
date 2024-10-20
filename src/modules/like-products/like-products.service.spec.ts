import { Test, TestingModule } from '@nestjs/testing';
import { LikeProductsService } from './like-products.service';

describe('LikeProductsService', () => {
  let service: LikeProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikeProductsService],
    }).compile();

    service = module.get<LikeProductsService>(LikeProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

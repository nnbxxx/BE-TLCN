import { Test, TestingModule } from '@nestjs/testing';
import { InventoryProductController } from './inventory-product.controller';
import { InventoryProductService } from './inventory-product.service';

describe('InventoryProductController', () => {
  let controller: InventoryProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryProductController],
      providers: [InventoryProductService],
    }).compile();

    controller = module.get<InventoryProductController>(InventoryProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

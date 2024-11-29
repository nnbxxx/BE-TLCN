import { Test, TestingModule } from '@nestjs/testing';
import { BlogCategoryController } from './blog-category.controller';
import { BlogCategoryService } from './blog-category.service';

describe('BlogCategoryController', () => {
  let controller: BlogCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogCategoryController],
      providers: [BlogCategoryService],
    }).compile();

    controller = module.get<BlogCategoryController>(BlogCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

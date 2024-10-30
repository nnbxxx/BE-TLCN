import { Test, TestingModule } from '@nestjs/testing';
import { AddressUserController } from './address-user.controller';
import { AddressUserService } from './address-user.service';

describe('AddressUserController', () => {
  let controller: AddressUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressUserController],
      providers: [AddressUserService],
    }).compile();

    controller = module.get<AddressUserController>(AddressUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

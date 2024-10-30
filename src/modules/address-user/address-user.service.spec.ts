import { Test, TestingModule } from '@nestjs/testing';
import { AddressUserService } from './address-user.service';

describe('AddressUserService', () => {
  let service: AddressUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressUserService],
    }).compile();

    service = module.get<AddressUserService>(AddressUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

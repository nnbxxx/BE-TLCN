import { Module } from '@nestjs/common';
import { AddressUserService } from './address-user.service';
import { AddressUserController } from './address-user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressUser, AddressUserSchema } from './schemas/address-user.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: AddressUser.name, schema: AddressUserSchema }])],

  controllers: [AddressUserController],
  providers: [AddressUserService],
  exports: [AddressUserService]
})
export class AddressUserModule { }

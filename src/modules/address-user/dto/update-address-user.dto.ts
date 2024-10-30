import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressUserDto } from './create-address-user.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateAddressUserDto extends PartialType(CreateAddressUserDto) {
    @IsMongoId({ message: '_id phải có dạng là mongo id' })
    @IsNotEmpty({ message: '_id không được để trống' })
    _id: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressUserDto } from './create-address-user.dto';
import { IsBoolean, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressUserDto extends PartialType(CreateAddressUserDto) {
    @IsMongoId({ message: '_id phải có dạng là mongo id' })
    @IsNotEmpty({ message: '_id không được để trống' })
    _id: string;
}

export class UpdateAddressUserDtoSWG {
    @IsMongoId({ message: '_id phải có dạng là mongo id' })
    @IsNotEmpty({ message: '_id không được để trống' })
    _id: string;
    @ApiProperty({ example: '671b34eb52ab878a12a3004a', description: 'Mã userId' })
    @IsMongoId({ message: 'userId phải là mongid' })
    @IsNotEmpty({ message: 'userId không được để trống' })
    @IsString({ message: "userId phải là string" })
    user: string
    @ApiProperty({ example: 'Ngô Nguyên Bảo', description: 'Tên người nhận' })
    @IsNotEmpty({ message: 'receiver không được để trống' })
    @IsString({ message: "receiver phải là string" }) // To make a field optional you can add @IsOptional
    receiver: string;
    @IsNotEmpty({ message: 'phone không được để trống' })
    @IsString({ message: "phone phải là string" }) // To make a field optional you can add @IsOptional
    @ApiProperty({ example: '0987654321', description: 'Số điện thoại' })
    phone: string;
    @IsNotEmpty({ message: 'province không được để trống' })
    @IsString({ message: "province phải là string" }) // To make a field optional you can add @IsOptional
    @ApiProperty({ example: 'Thành phố Hà Nội', description: 'Tên tỉnh/ thành phố' })
    province: string;
    @IsNotEmpty({ message: 'districts không được để trống' })
    @IsString({ message: "districts phải là string" }) // To make a field optional you can add @IsOptional
    @ApiProperty({ example: 'Quận Ba Đình', description: 'Tên quận/ huyện' })
    districts: string;
    @IsNotEmpty({ message: 'wards không được để trống' })
    @IsString({ message: "wards phải là string" }) // To make a field optional you can add @IsOptional
    @ApiProperty({ example: 'Phường Phúc Xá', description: 'Tên phường/ xã' })
    wards: string;
    @IsNotEmpty({ message: 'địa chỉ chi tiết không được để trống' })
    @IsString({ message: "địa chỉ chi tiết phải là string" }) // To make a field optional you can add @IsOptional
    @ApiProperty({ example: '1 đường abc xyz', description: 'Tên địa chỉ chi tiết' })
    specific: string;
    @IsNotEmpty({ message: 'isDefault không được để trống' })
    @IsBoolean({ message: "isDefault phải là kiểu boolean" })
    @ApiProperty({ example: false, description: 'Mã userId' })
    isDefault: boolean
}


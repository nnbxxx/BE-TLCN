import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressUserDto } from './dto/create-address-user.dto';
import { UpdateAddressUserDto } from './dto/update-address-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AddressUser, AddressUserDocument } from './schemas/address-user.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class AddressUserService {
  constructor(
    @InjectModel(AddressUser.name)
    private addressUserModel: SoftDeleteModel<AddressUserDocument>,
  ) { }

  async create(createAddressUserDto: CreateAddressUserDto, _user: IUser) {
    const { districts, phone, isDefault, province, receiver, specific, user, wards } = createAddressUserDto;
    const oldAddressUser = await this.addressUserModel.findOne({
      districts, phone, province, receiver, specific, user, wards
    });
    if (oldAddressUser) return oldAddressUser
    if (isDefault) {
      const addU = await this.addressUserModel.findOne({ isDefault: true })
      if (addU) {
        addU.isDefault = false;
        await addU.save();
      }
    }
    return await this.addressUserModel.create({
      ...createAddressUserDto,
    })

  }

  async findAll(currentPage: number, limit: number, qs: string,) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;


    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.addressUserModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.addressUserModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select([''])
      .populate(population)
      .exec();


    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }

  }
  async findDefaultAddress(user: IUser) {
    const re = await this.addressUserModel.findOne({ user: user._id, isDefault: true });
    if (re) {
      return re;
    }
    else {
      throw new NotFoundException('Không tìm thấy default address')
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} addressUser`;
  }

  async update(updateAddressUserDto: UpdateAddressUserDto, user: IUser) {
    return await this.addressUserModel.updateOne(
      { _id: updateAddressUserDto._id },
      {
        ...updateAddressUserDto,
      },
    );
  }
  remove(id: number) {
    return `This action removes a #${id} addressUser`;
  }
}

import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto, CreateAddressMultipleDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Address, AddressDocument, Districts } from './schemas/addresses.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name)
    private addressModel: Model<Address>
  ) { }
  async create(createAddressDto: CreateAddressDto) {

    const address = this.addressModel.create({ ...createAddressDto })
    return address;
  }
  async createMultiple(createAddressMultipleDto: CreateAddressMultipleDto) {
    createAddressMultipleDto.data.forEach(async (element) => {
      await this.addressModel.create({ ...element })
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.addressModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.addressModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select([])
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
  async getDistrictsByCityId(id: string) {
    const result = await this.addressModel.findOne({ Id: id })
    if (!result) {
      throw new NotFoundException(`Không có thành phố Id = ${id}`)
    }
    return result.Districts.map((district: Districts) => ({
      Id: district.Id,
      Name: district.Name,
    }));;
  }
  async getWardByCityId(provinceId: string, districtId: string) {
    const province = await this.addressModel.findOne({ Id: provinceId })
    if (!province) {
      throw new NotFoundException(`Không có thành phố Id = ${provinceId}`)
    }
    const district: Districts = province.Districts.find((district: Districts) => {
      return district.Id === districtId
    });
    if (!district) {
      throw new NotFoundException(`Không có quận/huyện/thành phố Id = ${districtId}`)
    }
    return district.Wards.map(ward => ({
      Id: ward.Id,
      Name: ward.Name,
    }));
  }
  findOne(id: string) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}

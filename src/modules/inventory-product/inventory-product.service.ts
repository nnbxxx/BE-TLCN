import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryProductDto } from './dto/create-inventory-product.dto';
import { UpdateInventoryProductDto } from './dto/update-inventory-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { InventoryProduct, InventoryProductDocument } from './schemas/inventory-product.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { ReceiptAdd, ReceiptItem } from '../receipts/dto/update-receipt.dto';

@Injectable()
export class InventoryProductService {
  constructor(
    @InjectModel(InventoryProduct.name)
    private inventoryProductModel: SoftDeleteModel<InventoryProductDocument>
  ) { }
  create(createInventoryProductDto: CreateInventoryProductDto, user: IUser) {
    return this.inventoryProductModel.create({
      ...createInventoryProductDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 1000;

    const totalItems = (await this.inventoryProductModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.inventoryProductModel.find(filter)
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
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found inventoryProduct with id=${id}`);
    }
    return await this.inventoryProductModel.findById(id);
  }
  async findByProductId(productId: string) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new BadRequestException(`not found inventoryProduct with id=${productId}`);
    }
    return await this.inventoryProductModel.findOne({
      productId: productId
    });
  }
  async getProductPurchased(productId: string) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new NotFoundException(`not found product with id=${productId}`);
    }
    return this.inventoryProductModel.findOne({ productId }).select(['reservations']);
  }
  async updateReceiptUser(receiptItems: ReceiptItem[], user: IUser) {
    receiptItems.map(async (item) => {
      const { product, price, quantity } = item as any
      const productInventory = await this.findByProductId(product);
      if (!productInventory) {
        throw new NotFoundException('Product not found');
      }
      const reservationData = {
        userId: user._id,
        quantity: quantity,
        price: price
      }
      productInventory.reservations.push(reservationData);
      await productInventory.save();

    })
  }
  // update(id: number, updateInventoryProductDto: UpdateInventoryProductDto) {
  //   return `This action updates a #${id} inventoryProduct`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} inventoryProduct`;
  // }
}

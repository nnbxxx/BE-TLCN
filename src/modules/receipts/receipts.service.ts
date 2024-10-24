import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Receipt, ReceiptDocument, ReceiptSchema } from './schemas/receipt.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ProductsService } from '../products/products.service';
import { IUser } from '../users/users.interface';
import dayjs from 'dayjs';
import mongoose from 'mongoose';
import { RECEIPT_STATUS } from 'src/constants/schema.enum';
import aqp from 'api-query-params';
import { AddressService } from '../address/addresses.service';
import { CartsService } from '../carts/carts.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectModel(Receipt.name)
    private receiptModel: SoftDeleteModel<ReceiptDocument>,
    private productService: ProductsService,
    private cartService: CartsService,
    private userService: UsersService,

  ) { }
  async create(createReceiptDto: CreateReceiptDto, user: IUser) {
    await this.validate(createReceiptDto)
    const receipt = await this.receiptModel.create({
      ...createReceiptDto,
      user: user._id,
      createdBy: {
        _id: user._id,
        email: user.email
      },
      confirmationDate: dayjs().add(30, 'minutes')
    });
    this.cartService.removeAllCartItem(user);
    return await this.calcTotal(receipt._id as any);
  }
  async validate(createReceiptDto: CreateReceiptDto) {
    const productsExist = await Promise.all(
      createReceiptDto.items.map(async (item) => {
        const product = await this.productService.findOne(item.product as any)
        return product !== null; // Trả về true nếu product tồn tại
      })
    );

    // Kiểm tra nếu tất cả sản phẩm đều hợp lệ
    const allProductsValid = productsExist.every((exists) => exists === true);

    if (!allProductsValid) {
      throw new NotFoundException(`Vui lòng kiểm tra lại danh sách sản phẩm có sản phẩm không hợp lệ`)
    }
  }

  async calcTotal(receiptId: string) {
    const found = await this.receiptModel.findById(receiptId);
    if (!found) throw new NotFoundException("receipt không tìm thấy");
    if (found.items.length === 0) {
      return await this.receiptModel.
        findByIdAndUpdate(receiptId, { $set: { total: 0 } }, { new: true });
    }
    const total = found.items.reduce((acc, cur: any) => {
      return acc + cur.price * cur.quantity
    }, 0);

    return await this.receiptModel.
      findByIdAndUpdate(receiptId, { $set: { total: total } }, { new: true });
  }
  async autoconfirm() {
    const unConfirmReceipts = await this.receiptModel.find({ statusUser: RECEIPT_STATUS.UNCONFIRMED }).select('_id');
    const promises = unConfirmReceipts.map(async (receipt) => {
      const re = await this.confirmReceipt(receipt._id);
      return re;
    });
    const results = await Promise.all(promises);
    const count = results.filter(Boolean).length;
    return {
      "quantityConfirmReceipts": count
    };

  }

  async confirmReceipt(receiptId: mongoose.Types.ObjectId) {
    const receipt = await this.findOne(receiptId as any)
    const date = dayjs(receipt.confirmationDate);
    if (receipt.statusUser === RECEIPT_STATUS.UNCONFIRMED && dayjs().isAfter(date)) {
      await this.receiptModel.findOneAndUpdate(
        { _id: receiptId },
        { $set: { statusUser: RECEIPT_STATUS.CONFIRMED, statusSupplier: RECEIPT_STATUS.CONFIRMED } },
        { new: true }
      );
      return true
    }
    return false
  }
  async findAll(currentPage: number, limit: number, qs: string, user: IUser) {
    const { filter, sort, population } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.receiptModel.find({ ...filter, user: user._id })).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.receiptModel.find({ ...filter, user: user._id })
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

  async findOne(receiptId: string) {
    if (!mongoose.Types.ObjectId.isValid(receiptId)) {
      throw new NotFoundException(`not found product with id=${receiptId}`);
    }
    const receipt = await this.receiptModel.findById(receiptId)
    if (!receipt) {
      throw new NotFoundException(`not found product with id=${receiptId}`);
    }
    return receipt;
  }

  async updateForUser(updateReceiptDto: UpdateReceiptDto) {
    const receipt = await this.findOne(updateReceiptDto._id)
    // chưa phân role
    // if (receipt.statusUser === RECEIPT_STATUS.CONFIRMED) {
    //   throw new BadRequestException(`Đơn hàng đã xác nhận, vui lòng liên hệ nhà cung cấp để cập nhật đơn hàng`)
    // }
    await this.receiptModel.updateOne({ _id: updateReceiptDto._id }, {
      ...updateReceiptDto
    })
    return await this.calcTotal(receipt._id as any);
  }

  async removeForUser(id: string, user: IUser) {
    const receipt = await this.findOne(id)
    if (receipt.statusUser === RECEIPT_STATUS.CONFIRMED) {
      throw new BadRequestException(`Đơn hàng đã xác nhận, vui lòng liên hệ nhà cung cấp để hủy đơn hàng`)
    }
    await this.receiptModel.updateOne(
      { _id: receipt._id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return this.receiptModel.softDelete({
      _id: id
    })

  }

  // thanh toán thành công 
  async confirmPayment(receiptId: string, user: IUser) {

    const receipt = await this.findOne(receiptId);
    const productIds = receipt.items.map(item => item.product._id.toString());
    if (receipt.statusUser !== RECEIPT_STATUS.CONFIRMED && receipt.statusUser !== RECEIPT_STATUS.DELIVERED) {
      this.userService.updatePurchasedProducts(user, productIds, receipt.total / 10)
      return await this.receiptModel.findOneAndUpdate(
        { _id: receiptId },
        { $set: { statusUser: RECEIPT_STATUS.CONFIRMED, statusSupplier: RECEIPT_STATUS.DELIVERED } },
        { new: true }
      );
    }
    return await this.receiptModel.findOneAndUpdate(
      { _id: receiptId },
    );

  }

}

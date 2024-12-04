import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from 'src/modules/blog/schemas/blog.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';
import { Receipt, ReceiptDocument } from 'src/modules/receipts/schemas/receipt.schemas';
import { RECEIPT_STATUS } from 'src/constants/schema.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Blog.name)
    private blogModel: SoftDeleteModel<BlogDocument>,
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Receipt.name)
    private receiptModel: SoftDeleteModel<ReceiptDocument>,

  ) { }

  async getDashboardCardInfo() {
    const quantityBlog = await this.blogModel.countDocuments({}).exec();
    const quantityUser = await this.userModel.countDocuments({}).exec();
    const totalReceipt = await this.receiptModel.aggregate([
      {
        $match: {
          statusUser: RECEIPT_STATUS.DELIVERED, // Lọc các hóa đơn có statusUser là DELIVERED
        },
      },
      {
        $group: {
          _id: null, // Không cần nhóm cụ thể, chỉ cần tổng tiền
          totalSum: { $sum: '$total' }, // Tính tổng trường `total`
        },
      },
    ]);
    const result = await this.receiptModel.aggregate([
      {
        $match: {
          statusUser: 'DELIVERED', // Lọc các hóa đơn có trạng thái user là DELIVERED
        },
      },
      {
        $unwind: '$items', // Tách mảng `items` thành từng tài liệu riêng biệt
      },
      {
        $group: {
          _id: null, // Không cần nhóm cụ thể
          totalQuantity: { $sum: '$items.quantity' }, // Tính tổng quantity trong các items
        },
      },
    ]);
    return {
      quantityBlog, quantityUser, totalRevenue: totalReceipt[0].totalSum, totalProductPruchased: result[0].totalQuantity
    }
  }
  // create(createDashboardDto: CreateDashboardDto) {
  //   return 'This action adds a new dashboard';
  // }

  // findAll() {
  //   return `This action returns all dashboard`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} dashboard`;
  // }

  // update(id: number, updateDashboardDto: UpdateDashboardDto) {
  //   return `This action updates a #${id} dashboard`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} dashboard`;
  // }
}

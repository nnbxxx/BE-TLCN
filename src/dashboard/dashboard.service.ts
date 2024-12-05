import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from 'src/modules/blog/schemas/blog.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';
import { Receipt, ReceiptDocument } from 'src/modules/receipts/schemas/receipt.schemas';
import { RECEIPT_STATUS } from 'src/constants/schema.enum';
import { InventoryProductService } from 'src/modules/inventory-product/inventory-product.service';
import { Brand, BrandDocument } from 'src/brand/schemas/brand.schemas';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Blog.name)
    private blogModel: SoftDeleteModel<BlogDocument>,
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Receipt.name)
    private receiptModel: SoftDeleteModel<ReceiptDocument>,
    @InjectModel(Brand.name)
    private brandModel: SoftDeleteModel<BrandDocument>,

    private inventoryProductService: InventoryProductService,
  ) { }

  async getDashboardCardInfo() {
    const quantityBlog = await this.blogModel.countDocuments({}).exec();
    const quantityUser = await this.userModel.countDocuments({}).exec();
    const quantityBrand = await this.brandModel.countDocuments({}).exec();
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
    const totalProductPurchased = await this.receiptModel.aggregate([
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
    const dataTopSellingProducts = await this.inventoryProductService.getTopProductsWithReservations();
    const re = await this.getMonthlyTotal(2024);
    console.log("🚀 ~ DashboardService ~ getDashboardCardInfo ~ re:", re)

    return {
      quantityBlog, quantityUser, quantityBrand, totalRevenue: totalReceipt[0].totalSum, totalProductPruchased: totalProductPurchased[0].totalQuantity,
      dataTopSellingProducts
    }
  }

  async getMonthlyTotal(year: number) {
    // Tên các tháng bằng tiếng Anh
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Tạo startDate và endDate cho mỗi tháng của năm
    const startOfYear = new Date(year, 0, 1); // Ngày đầu tiên của năm
    const endOfYear = new Date(year + 1, 0, 1); // Ngày đầu tiên của năm tiếp theo

    // Aggregation pipeline để tính toán tổng hóa đơn theo tháng
    const pipeline = [
      {
        $match: {
          statusUser: "DELIVERED", // Lọc hóa đơn có trạng thái DELIVERED
          createdAt: {
            $gte: startOfYear, // Hóa đơn được tạo từ đầu năm
            $lt: endOfYear // Hóa đơn được tạo đến hết năm
          }
        }
      },
      {
        $project: {
          month: { $month: "$createdAt" }, // Trích xuất tháng từ trường createdAt
          total: 1 // Giữ trường total trong hóa đơn
        }
      },
      {
        $group: {
          _id: "$month", // Nhóm theo tháng
          totalAmount: { $sum: "$total" } // Tính tổng giá trị theo tháng
        }
      },
      {
        $sort: { _id: 1 } // Sắp xếp theo tháng từ tháng 1 đến tháng 12
      }
    ];

    // Thực hiện aggregation với pipeline
    const result = await this.receiptModel.aggregate(pipeline as any);

    // Đảm bảo mỗi tháng đều có dữ liệu, nếu không có thì khởi tạo với 0
    const monthlyTotals = monthNames.map((month, index) => {
      const monthData = result.find(r => r._id === index + 1);
      return {
        month,
        value: monthData ? monthData.totalAmount : 0
      };
    });

    return monthlyTotals;
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

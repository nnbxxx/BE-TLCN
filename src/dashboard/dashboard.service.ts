import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from 'src/modules/blog/schemas/blog.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';
import { Receipt, ReceiptDocument } from 'src/modules/receipts/schemas/receipt.schemas';
import { INVENTORY_ACTION, RECEIPT_STATUS, TYPE_TIME_FILTER } from 'src/constants/schema.enum';
import { InventoryProductService } from 'src/modules/inventory-product/inventory-product.service';
import { Brand, BrandDocument } from 'src/brand/schemas/brand.schemas';
import { getTimeRangeFromDate } from 'src/util/util';
import { InventoryProduct, InventoryProductDocument } from 'src/modules/inventory-product/schemas/inventory-product.schemas';


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
    @InjectModel(InventoryProduct.name)
    private inventoryProductModel: SoftDeleteModel<InventoryProductDocument>,

    private inventoryProductService: InventoryProductService,
  ) { }

  async getDashboardCardInfo(time: TYPE_TIME_FILTER) {
    const inforBlog = await this.countBlogsCreatedInTimeRange(time);
    const inforUser = await this.countUsersCreatedInTimeRange(time);
    const inforProductExport = await this.countProductDeliveredInTimeRange(time);
    const inforProductImport = await this.countProductImportInTimeRange(time);
    const inforInventoryProduct = await this.getTotalInventorySummary();
    const inforRevenue = await this.countRevenueInTimeRange(time);
    return {
      inforUser, inforBlog, inforProductExport, inforProductImport, inforInventoryProduct, inforRevenue
    }
  }
  async countUsersCreatedInTimeRange(type: TYPE_TIME_FILTER) {
    const { from, to } = getTimeRangeFromDate(type);

    const [fromCount, toCount] = await Promise.all([
      this.userModel.countDocuments({ createdAt: { $lte: from } }).exec(),
      this.userModel.countDocuments({ createdAt: { $lte: to } }).exec(),
    ]);

    return {
      fromCount,
      toCount,
    };
  }
  async countBlogsCreatedInTimeRange(type: TYPE_TIME_FILTER) {
    const { from, to } = getTimeRangeFromDate(type);

    const [fromCount, toCount] = await Promise.all([
      this.blogModel.countDocuments({ createdAt: { $lte: from } }).exec(),
      this.blogModel.countDocuments({ createdAt: { $lte: to } }).exec(),
    ]);

    return {
      fromCount,
      toCount,
    };
  }
  async countProductDeliveredInTimeRange(type: TYPE_TIME_FILTER) {
    const { from: from1, to: to1 } = getTimeRangeFromDate(type); // 21/1 - 28/1
    const { from: from2, to: to2 } = getTimeRangeFromDate(type, from1); // 14/1 - 21/1
    const [fromCount, toCount] = await Promise.all([
      this.getTotalQuantityDelivered(from2, to2),
      this.getTotalQuantityDelivered(from1, to1),
    ]);

    return {
      fromCount,
      toCount,
    };
  }
  async countProductImportInTimeRange(type: TYPE_TIME_FILTER) {
    const { from: from1, to: to1 } = getTimeRangeFromDate(type); // 21/1 - 28/1
    const { from: from2, to: to2 } = getTimeRangeFromDate(type, from1); // 14/1 - 21/1
    const [fromCount, toCount] = await Promise.all([
      this.getTotalImportAmount(from2, to2),
      this.getTotalImportAmount(from1, to1),
    ]);

    return {
      fromCount,
      toCount,
    };
  }
  async countRevenueInTimeRange(type: TYPE_TIME_FILTER) {
    const { from: from1, to: to1 } = getTimeRangeFromDate(type); // 21/1 - 28/1
    const { from: from2, to: to2 } = getTimeRangeFromDate(type, from1); // 14/1 - 21/1
    const [fromCount, toCount] = await Promise.all([
      this.calculateTotalReceiptAmount(from2, to2),
      this.calculateTotalReceiptAmount(from1, to1),
    ]);

    return {
      fromCount,
      toCount,
    };
  }

  async getTotalQuantityDelivered(from: Date, to: Date): Promise<number> {
    const result = await this.receiptModel.aggregate([
      {
        $match: {
          statusUser: RECEIPT_STATUS.DELIVERED,
          statusSupplier: RECEIPT_STATUS.DELIVERED,
          createdAt: {
            $gte: from,
            $lte: to,
          },
        },
      },
      {
        $unwind: '$items',
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$items.quantity' },
        },
      },
    ]).exec();

    return result[0]?.totalQuantity || 0;
  }
  async getTotalInventorySummary() {
    const allInventory = await this.inventoryProductModel.find({ isDeleted: false });
    let totalStock = 0;
    let totalValue = 0;
    for (const inventory of allInventory) {
      for (const variant of inventory.productVariants) {
        const quantity = variant.stock || 0;
        const price = variant.importPrice || 0;

        totalStock += quantity;
        totalValue += quantity * price;
      }
    }

    return {
      totalStock,
      totalValue
    };
  }
  async getTotalImportAmount(startDate: Date, endDate: Date): Promise<number> {
    const inventoryProducts = await this.inventoryProductModel.find({
      stockHistory: {
        $elemMatch: {
          action: INVENTORY_ACTION.IMPORT,
          date: { $gte: startDate, $lte: endDate }
        }
      }
    }).lean();

    let totalImportAmount = 0;

    for (const product of inventoryProducts) {
      for (const history of product.stockHistory) {
        if (
          history.action === INVENTORY_ACTION.IMPORT &&
          history.date >= startDate &&
          history.date <= endDate
        ) {
          totalImportAmount += history.price;
        }
      }
    }

    return totalImportAmount;
  }
  async calculateTotalReceiptAmount(fromDate: Date, toDate: Date): Promise<number> {
    const result = await this.receiptModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
          },
          isDeleted: { $ne: true } // loại bỏ hóa đơn đã xóa nếu cần
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$total' },
        }
      }
    ]);

    return result[0]?.totalAmount || 0;
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

}

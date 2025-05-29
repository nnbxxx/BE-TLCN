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
import { LikeProduct, LikeProductDocument } from 'src/modules/like-products/schemas/like-product.schemas';


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
    @InjectModel(LikeProduct.name)
    private likeProductModel: SoftDeleteModel<LikeProductDocument>,

    private inventoryProductService: InventoryProductService,
  ) { }

  async getDashboardCardInfoTime(time: TYPE_TIME_FILTER) {
    const inforBlog = await this.countBlogsCreatedInTimeRange(time);
    const inforUser = await this.countUsersCreatedInTimeRange(time);
    const inforProductExport = await this.countProductDeliveredInTimeRange(time);
    const inforProductImport = await this.countProductImportInTimeRange(time);
    const inforRevenue = await this.countRevenueInTimeRange(time);

    return {
      inforUser, inforBlog, inforProductExport, inforProductImport, inforRevenue,
    }
  }
  async getDashboardCardInfo() {

    const inforInventoryProduct = await this.getTotalInventorySummary();
    const inforUsersAndBuyers = await this.countUsersAndBuyers();
    const dataTopBuyers = await this.getTopUsersByDistinctProducts();
    const inforInventorySumary = await this.getInventorySummary();
    const dataTopSellingProduct = await this.getTopSellingProducts();
    const dataTopLikeProduct = await this.getTopLikedProducts();
    const dataTopViewProduct = await this.getTopViewedProducts();
    return {
      inforInventoryProduct, inforUsersAndBuyers, dataTopBuyers, inforInventorySumary, dataTopSellingProduct, dataTopLikeProduct, dataTopViewProduct
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
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    // Tính tổng tiền bán theo tháng
    const receiptPipeline = [
      {
        $match: {
          statusUser: "DELIVERED",
          createdAt: { $gte: startOfYear, $lt: endOfYear }
        }
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          total: 1
        }
      },
      {
        $group: {
          _id: "$month",
          totalAmount: { $sum: "$total" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ];

    const receiptResult = await this.receiptModel.aggregate(receiptPipeline as any);

    // Tính tổng tiền nhập kho theo tháng
    const monthlyTotals = [];

    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 1);

      // Tổng bán hàng
      const receiptData = receiptResult.find(r => r._id === month + 1);
      const totalSales = receiptData ? receiptData.totalAmount : 0;

      // Tổng nhập kho
      const inventoryProducts = await this.inventoryProductModel.find({
        stockHistory: {
          $elemMatch: {
            action: INVENTORY_ACTION.IMPORT,
            date: { $gte: monthStart, $lt: monthEnd }
          }
        }
      }).lean();

      let totalImportAmount = 0;
      for (const product of inventoryProducts) {
        for (const history of product.stockHistory) {
          if (
            history.action === INVENTORY_ACTION.IMPORT &&
            history.date >= monthStart &&
            history.date < monthEnd
          ) {
            totalImportAmount += history.price;
          }
        }
      }

      monthlyTotals.push({
        month: monthNames[month],
        sales: totalSales,
        import: totalImportAmount
      });
    }
    return monthlyTotals;
  }
  async countUsersAndBuyers(): Promise<{ totalUsers: number; buyers: number }> {
    const totalUsers = await this.userModel.countDocuments({});
    const buyers = await this.userModel.countDocuments({
      purchasedProducts: { $exists: true, $not: { $size: 0 } },
    });

    return { totalUsers, buyers };
  }
  async getTopUsersByDistinctProducts(limit = 20): Promise<
    { userId: string; name: string; avatar: string; totalItems: number }[]
  > {
    return this.userModel.aggregate([
      {
        $project: {
          userId: { $toString: "$_id" },
          name: 1,
          avatar: 1,
          totalItems: {
            $size: {
              $ifNull: [
                {
                  $setUnion: [
                    {
                      $map: {
                        input: "$purchasedProducts",
                        as: "item",
                        in: "$$item.productId"
                      }
                    }
                  ]
                },
                []
              ]
            }
          }
        }
      },
      {
        $sort: { totalItems: -1 }
      },
      {
        $limit: limit
      }
    ]);
  }
  async getInventorySummary() {
    const result = await this.inventoryProductModel.aggregate([
      {
        $facet: {
          totalProducts: [
            { $match: { isDeleted: false } },
            { $count: "count" }
          ],
          soldAtLeastOne: [
            { $match: { isDeleted: false, totalQuantitySell: { $gt: 0 } } },
            { $count: "count" }
          ]
        }
      },
      {
        $project: {
          totalProducts: { $arrayElemAt: ["$totalProducts.count", 0] },
          soldAtLeastOne: { $arrayElemAt: ["$soldAtLeastOne.count", 0] }
        }
      }
    ]);

    return result[0] || { totalProducts: 0, soldAtLeastOne: 0 };
  }
  async getTopSellingProducts(limit = 20) {
    const result = await this.inventoryProductModel.aggregate([
      {
        $match: {
          isDeleted: false,
          totalQuantitySell: { $gt: 0 }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $project: {
          _id: 0,
          name: "$productInfo.name",
          totalSold: "$totalQuantitySell",
          image: { $arrayElemAt: ["$productInfo.images", 0] } // Đảm bảo field image có trong schema Product
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit }
    ]);

    return result;
  }
  async getTopLikedProducts(limit = 20) {
    const topLiked = await this.likeProductModel.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          image: { $arrayElemAt: ["$productInfo.images", 0] }, // nếu là mảng thì dùng `$product.image[0]`
          totalLike: '$count',
        },
      },
    ]);

    return topLiked;
  }
  async getTopViewedProducts(): Promise<any[]> {

    // Aggregation pipeline
    const result = await this.userModel.aggregate([
      { $unwind: '$recentViewProducts' },

      {
        $group: {
          _id: '$recentViewProducts.productId',
          viewCount: { $sum: 1 },
        },
      },
      { $sort: { viewCount: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          name: '$productInfo.name',
          totalLike: '$productInfo.totalLike',
          image: { $arrayElemAt: ["$productInfo.images", 0] },
          viewCount: 1,
        },
      },
    ]);

    return result;
  }
}

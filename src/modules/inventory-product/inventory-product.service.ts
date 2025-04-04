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
    receiptItems.map(async (item: any) => {
      const { product, price, quantity, color } = item
      const productInventory = await this.findByProductId(product);
      //productInventory.quantity -= quantity;
      if (!productInventory) {
        throw new NotFoundException('Product not found');
      }
      const reservationData = {
        userId: user._id,
        quantity: quantity,
        price: price,
        color: color,
      }
      //productInventory.reservations.push(reservationData);
      await productInventory.save();

    })
  }
  async getTopProductsWithReservations() {
    const results = await this.inventoryProductModel
      .aggregate([
        {
          $addFields: {
            totalQuantityBought: {
              $sum: '$reservations.quantity', // Tính tổng quantity trong reservations
            },
          },
        },
        { $sort: { totalQuantityBought: -1 } }, // Sắp xếp giảm dần theo tổng quantity
        { $limit: 10 }, // Giới hạn top 10
      ])
      .exec()
      .then((data) =>
        this.inventoryProductModel.populate(data, { path: 'productId', select: 'name' })
      );

    // Lấy mảng chỉ gồm {name, totalQuantityBought}
    return results.map((item: any) => ({
      name: item.productId.name,
      totalQuantityBought: item.totalQuantityBought,
    }));
  }


  async importStock(
    productId: string,
    variants: {
      color?: string;
      size?: string;
      material?: string;
      quantity: number;
      importPrice: number;
      exportPrice?: number;
    }[],
    user: IUser
  ) {
    // Tìm kho hàng của sản phẩm
    const inventory = await this.inventoryProductModel.findOne({ productId });

    if (!inventory) {
      throw new NotFoundException("Sản phẩm không tồn tại trong kho.");
    }

    let totalAdded = 0;
    let totalImportValue = 0;

    variants.forEach(({ color, size, material, quantity, importPrice, exportPrice }) => {
      let variantIndex: number | null = null;
      let oldStock = 0;

      // Kiểm tra nếu không có thuộc tính (color, size, material) thì tìm biến thể không có attributes
      const isNoAttributes = !color && !size && !material;

      if (isNoAttributes) {
        variantIndex = inventory.productVariants.findIndex(v => !v.attributes || Object.keys(v.attributes).length === 0);
      } else {
        variantIndex = inventory.productVariants.findIndex(v => {
          const attr = v.attributes || {};
          return (!color || attr.color === color) &&
            (!size || attr.size === size) &&
            (!material || attr.material === material);
        });
      }

      if (variantIndex !== -1) {
        // Nếu tìm thấy biến thể → Lưu lại stock cũ trước khi xóa
        oldStock = inventory.productVariants[variantIndex].stock;
        inventory.productVariants.splice(variantIndex, 1);
      }

      // Tạo biến thể mới với dữ liệu đã cập nhật
      const attributes: Record<string, any> = {};
      if (color) attributes.color = color;
      if (size) attributes.size = size;
      if (material) attributes.material = material;

      const newVariant = {
        attributes,
        importPrice,
        exportPrice: exportPrice ?? 0, // Giá xuất mặc định là 0 nếu không có
        stock: quantity + oldStock, // Cộng dồn stock cũ vào số lượng nhập mới
        discount: 0
      };

      // Thêm lại biến thể mới vào danh sách
      inventory.productVariants.push(newVariant);

      totalAdded += quantity;
      totalImportValue += importPrice * quantity;
    });

    // Cập nhật tổng số lượng của kho
    inventory.totalQuantity += totalAdded;

    // Thêm lịch sử nhập kho
    inventory.stockHistory.push({
      userId: user._id as any,
      quantity: totalAdded,
      price: totalImportValue,
      action: "import",
      date: new Date()
    });

    // Lưu thông tin kho sau khi cập nhật
    await inventory.save();

    return { message: "Nhập hàng thành công", totalAdded };
  }





  // update(id: number, updateInventoryProductDto: UpdateInventoryProductDto) {
  //   return `This action updates a #${id} inventoryProduct`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} inventoryProduct`;
  // }
}

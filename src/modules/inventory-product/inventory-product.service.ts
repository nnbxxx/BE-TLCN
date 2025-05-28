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
import { INVENTORY_ACTION } from 'src/constants/schema.enum';

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
      const { price, color, _id, name, size } = item.product
      const { quantity } = item;
      const inventory = await this.findByProductId(_id);
      //productInventory.quantity -= quantity;
      if (!inventory) {
        throw new NotFoundException('Product not found');
      }

      let variantIndex: number | null = null;

      // Kiểm tra nếu không có thuộc tính (color, size, material) thì tìm biến thể không có attributes
      variantIndex = inventory.productVariants.findIndex(v => {
        const attr = v.attributes || {};


        return (!color || attr.color === color) &&
          (!size || attr.size === size)
      });

      let newVariant: any;
      if (variantIndex !== -1) {
        // Nếu tìm thấy biến thể → Lưu lại stock cũ trước khi xóa
        const { stock, discount, importPrice, exportPrice, attributes, sellPrice } = inventory.productVariants[variantIndex]
        if (stock - quantity < 0) {
          throw new BadRequestException("Not Enough Product in Inventory")
        }
        inventory.productVariants.splice(variantIndex, 1);
        newVariant = {
          attributes,
          importPrice: importPrice,
          exportPrice, // Giá xuất mặc định là 0 nếu không có
          stock: stock - quantity, // Cộng dồn stock cũ vào số lượng nhập mới
          discount: discount,
          sellPrice: sellPrice
        };
        console.log("🚀 ~ InventoryProductService ~ receiptItems.map ~ newVariant:", newVariant)
        if (color) newVariant.attributes.color = color;
        if (size) newVariant.attributes.size = size;
        // Thêm lại biến thể mới vào danh sách
        inventory.productVariants.push(newVariant);

        // Cập nhật tổng số lượng của kho
        inventory.totalQuantity -= quantity;
        inventory.totalQuantitySell += quantity;
        // Thêm lịch sử nhập kho
        inventory.stockHistory.push({
          userId: user._id as any,
          quantity: quantity,
          price: sellPrice * quantity,
          action: INVENTORY_ACTION.EXPORT,
          date: new Date(),
          variants: attributes
        });

        // Lưu thông tin kho sau khi cập nhật
      }

      await inventory.save();

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


  async manageStock(
    productId: string,
    variants: {
      color?: string;
      size?: string;
      material?: string;
      quantity: number;
      importPrice: number;
      exportPrice?: number;
      discount?: number;
      sellPrice?: number;
    }[],
    user: IUser,
    type: INVENTORY_ACTION = INVENTORY_ACTION.IMPORT
  ) {
    // Tìm kho hàng của sản phẩm
    const inventory = await this.inventoryProductModel.findOne({ productId });

    if (!inventory) {
      throw new NotFoundException("Sản phẩm không tồn tại trong kho.");
    }
    if (type === INVENTORY_ACTION.IMPORT) {
      let totalAdded = 0;
      let totalImportValue = 0;

      variants.forEach(({ color, size, material, quantity, importPrice, exportPrice, discount }) => {
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
        let oldExportPrice: number;
        if (variantIndex !== -1) {
          // Nếu tìm thấy biến thể → Lưu lại stock cũ trước khi xóa
          const { stock, discount, importPrice } = inventory.productVariants[variantIndex]
          oldStock = stock;
          oldExportPrice = (importPrice * stock);

          inventory.productVariants.splice(variantIndex, 1);
        }

        // Tạo biến thể mới với dữ liệu đã cập nhật
        // (0 + 10*10)/(10+0)*(100-0)*(100+10)/(100*100)
        const newPrice = (oldExportPrice + quantity * importPrice) / (quantity + oldStock) * (100 - discount) * (100 + exportPrice) / (100 * 100);

        const newImportPrice = (oldExportPrice + quantity * importPrice) / (quantity + oldStock)
        let newVariant: any = {
          attributes: {} as any,
          importPrice: newImportPrice,
          exportPrice, // Giá xuất mặc định là 0 nếu không có
          stock: quantity + oldStock, // Cộng dồn stock cũ vào số lượng nhập mới
          discount: discount ?? 0,
          sellPrice: newPrice
        };

        if (color) newVariant.attributes.color = color;
        if (size) newVariant.attributes.size = size;
        if (material) newVariant.attributes.material = material;
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
        action: type,
        date: new Date(),
        variants: variants
      });

      // Lưu thông tin kho sau khi cập nhật
      await inventory.save();

      return { message: "Nhập hàng thành công", totalAdded };
    }

  }

  async checkProductAvailability(product: {
    _id: string,
    price: number,
    quantity: number,
    color: string,
    size: string
  }) {
    const { _id, quantity, color, size } = product;

    // Tìm InventoryProduct theo productId
    const inventory = await this.inventoryProductModel.findOne({ productId: _id });

    if (!inventory) {
      throw new BadRequestException(`not found product with id=${product._id}`);
    }

    // Tìm biến thể khớp color và size
    const matchedVariant = inventory.productVariants.find(variant => {
      const attributes = variant.attributes;
      return (
        attributes.color === color &&
        attributes.size === size
      );
    });

    if (!matchedVariant) {
      throw new BadRequestException(`not found varients with color=${product.color} and size= ${product.size}`);
    }


    if (matchedVariant.stock < quantity) {
      throw new BadRequestException(`not enough product`);
    }

    return true;
  }
  async update(updateInventoryProduct: UpdateInventoryProductDto, user: IUser) {
    const { productId, productVariants } = updateInventoryProduct;

    const existingInventory = await this.inventoryProductModel.findOne({ productId });

    if (!existingInventory) {
      throw new BadRequestException(`Not found inventory product with id =${productId}`);
    }

    const existingVariants = existingInventory.productVariants || [];

    // So sánh dựa trên các key-value thực tế có mặt trong biến thể mới
    const isSameVariant = (a: any, b: any) => {
      // So sánh các thuộc tính 'color', 'size', 'material'
      return a.attributes.color === b.attributes.color &&
        a.attributes.size === b.attributes.size &&
        a.attributes.material === b.attributes.material;
    };

    // Lọc các biến thể mới
    const newVariants = productVariants.filter(newVar => {
      // Nếu không có biến thể cũ nào giống biến thể mới này, thì thêm vào danh sách mới
      return !existingVariants.some(existingVar => isSameVariant(newVar, existingVar));
    });

    if (newVariants.length === 0) {
      return existingInventory; // Nếu không có biến thể mới, trả lại dữ liệu cũ
    }

    const updatedVariants = [...existingVariants, ...newVariants];

    return this.inventoryProductModel.findOneAndUpdate(
      { productId },
      {
        productVariants: updatedVariants,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
        updatedAt: new Date(),
      },
      { new: true }
    );
  }
}


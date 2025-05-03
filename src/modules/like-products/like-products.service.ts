import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLikeProductDto } from './dto/create-like-product.dto';
import { AddLikeProductDto, UpdateLikeProductDto } from './dto/update-like-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LikeProduct, LikeProductDocument } from './schemas/like-product.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '../users/users.interface';
import mongoose, { Types } from 'mongoose';
import { Product } from '../products/schemas/product.schemas';
import { InventoryProductService } from '../inventory-product/inventory-product.service';
import { Category } from '../categories/schemas/category.Schemas';
import { ProductsService } from '../products/products.service';

@Injectable()
export class LikeProductsService {
  constructor(
    @InjectModel(LikeProduct.name)
    private likeProductModel: SoftDeleteModel<LikeProductDocument>,
    private inventoryProductService: InventoryProductService,
    private productService: ProductsService,

  ) { }
  create(user: IUser) {

    return this.likeProductModel.create({
      user: user._id,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
  }
  async findByUser(user: IUser) {
    // Lấy likeProduct của user, có populate category trong từng item
    let re = await this.likeProductModel
      .findOne({ user: user._id })
      .select("-__v -updatedAt -createdAt -isDeleted -deletedAt")
      .populate({
        path: "items",
        model: Product.name,
        select: "_id name price images brand rating category",
        populate: {
          path: "category",
          model: Category.name,
          select: "_id name"
        }
      });

    // // Nếu không có dữ liệu thì trả về null
    // if (!re || !re.items || re.items.length === 0) {
    //   return re;
    // }

    // Bổ sung thông tin tồn kho cho từng sản phẩm
    const itemsWithInventory = await this.productService.addInforInventoryProduct(re.items);

    // Gán lại danh sách items đã có inventory
    // re.items = itemsWithInventory;
    let newdata = {
      ...re.toObject(),
      items: itemsWithInventory
    };

    return newdata;
  }


  async removeProduct(idProduct: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(idProduct)) {
      throw new BadRequestException(`Not found product with id=${idProduct}`);
    }

    // Tìm giỏ hàng của người dùng
    const foundCart = await this.likeProductModel.findOne({ user: user._id });
    if (!foundCart) {
      throw new BadRequestException(`Like Product not found for user with id=${user._id}`);
    }

    // Kiểm tra nếu sản phẩm có trong danh sách
    const productIndex = foundCart.items.findIndex((item: any) => {
      return item.equals(new mongoose.Types.ObjectId(idProduct))
    }
    );

    if (productIndex === -1) {
      throw new BadRequestException(`Like Product with id=${idProduct} not found`);
    }

    // Loại bỏ sản phẩm khỏi danh sách
    foundCart.items.splice(productIndex, 1);

    // Lưu lại giỏ hàng sau khi loại bỏ sản phẩm
    await foundCart.save();

    return foundCart;
  }
  async removeAll(user: IUser) {
    const foundCart = await this.likeProductModel.findOneAndUpdate(
      {
        user: user._id,
      },
      {
        $set: { items: [] }
      },
      { new: true },
    )

    return foundCart;
  }
  async addProduct(productLikeItem: AddLikeProductDto, user: IUser) {

    if (!mongoose.Types.ObjectId.isValid(productLikeItem._id)) {
      throw new BadRequestException(`not found product with id=${productLikeItem._id}`);
    }
    const foundProducts = await this.likeProductModel
      .findOne({ user: user._id })
      .select("-__v -updatedAt -createdAt");
    const isItemExist = await this.checkIsItemExit(productLikeItem._id as any, foundProducts.items as any)
    const { items } = foundProducts;
    if (isItemExist) {
      foundProducts.items = [...items, new mongoose.Types.ObjectId(productLikeItem._id)] as any;
      await foundProducts.save();
    }

    return foundProducts;
  }
  async checkIsItemExit(productId: mongoose.Types.ObjectId, userProductList: mongoose.Types.ObjectId[]) {
    // Sử dụng phương thức some để kiểm tra sự tồn tại của item trong danh sách
    return !userProductList.some(item => item.equals(productId));
  }
  async checkProductFavorite(productId: string, user: IUser) {
    // Kiểm tra tính hợp lệ của ID sản phẩm
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new BadRequestException(`Not found product with id=${productId}`);
    }

    // Tìm giỏ hàng của người dùng
    const foundCart = await this.likeProductModel.findOne({ user: user._id });

    // Nếu không tìm thấy giỏ hàng, trả về false
    if (!foundCart) {
      return { checkProduct: false };
    }

    // Kiểm tra sản phẩm có trong danh sách yêu thích không
    const isProductFavorite = foundCart.items.some((item: any) =>
      item.equals(new mongoose.Types.ObjectId(productId))
    );

    // Trả về kết quả kiểm tra
    return { checkProduct: isProductFavorite };
  }
}

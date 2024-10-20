import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLikeProductDto } from './dto/create-like-product.dto';
import { ProductLikeItem, UpdateLikeProductDto } from './dto/update-like-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LikeProduct, LikeProductDocument } from './schemas/like-product.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '../users/users.interface';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class LikeProductsService {
  constructor(
    @InjectModel(LikeProduct.name)
    private likeProductModel: SoftDeleteModel<LikeProductDocument>,
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

    return await this.likeProductModel
      .findOne({ user: user._id })
      .select("-__v -updatedAt -createdAt");
  }
  async checkedItemLikeProducts(userId: Types.ObjectId, proId: Types.ObjectId) {
    const isItemExist = await this.likeProductModel.findOne({
      user: userId,
      "items.product": proId,
    })
    if (!isItemExist) throw new BadRequestException("Product does not exist in the Like Products.");
  }
  async removeProduct(idProduct: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(idProduct)) {
      throw new BadRequestException(`not found product with id=${idProduct}`);
    }
    await this.checkedItemLikeProducts(user._id as any, idProduct as any);
    return await this.likeProductModel.findOneAndUpdate(
      { user: user._id },
      {
        $pull: { items: { product: idProduct } }
      },
      { new: true }

    );

  }
  async removeAll(user: IUser) {
    const foundCart = await this.likeProductModel.findOneAndUpdate(
      {
        user: user._id,
      },
      {
        $set: { items: [], total: 0 }
      },
      { new: true },
    )

    return foundCart;
  }
  async addProduct(productLikeItem: ProductLikeItem, user: IUser) {

    if (!mongoose.Types.ObjectId.isValid(productLikeItem.product._id)) {
      throw new BadRequestException(`not found product with id=${productLikeItem.product._id}`);
    }
    const foundProducts = await this.findByUser(user)
    const isItemExist = await this.checkIsItemExit(productLikeItem.product._id as any, foundProducts.items)
    if (!isItemExist) {
      return await this.likeProductModel.findOneAndUpdate(
        {
          user: user._id,
          items: { $elemMatch: { product: productLikeItem.product._id } },
        },
        {
          $set: {
            "items.$": {
              product: productLikeItem.product._id,
              name: productLikeItem.product.name,
            }
          },
        },
        { new: true },
      )
    }
    else {
      return await this.likeProductModel.findByIdAndUpdate(
        foundProducts._id,
        {
          $push: {
            items: {
              product: productLikeItem.product._id,
              name: productLikeItem.product.name,

            }
          },
        },
        { new: true },
      )
    }
  }
  async checkIsItemExit(productId: mongoose.Types.ObjectId, userProductList: any) {
    const itemExist = userProductList.filter(item => {
      if (item.product) {
        return item.product.equals(productId)
      }
      return false
    });
    return (itemExist.length === 0)
  }
  findAll() {
    return `This action returns all likeProducts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} likeProduct`;
  }

  update(id: number, updateLikeProductDto: UpdateLikeProductDto) {
    return `This action updates a #${id} likeProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} likeProduct`;
  }
}

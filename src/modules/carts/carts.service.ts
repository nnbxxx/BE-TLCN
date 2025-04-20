import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartItem, UpdateToCartDto } from './dto/update-cart.dto';
import { IUser } from '../users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import { ProductsService } from '../products/products.service';
import mongoose, { Types } from 'mongoose';
import { InventoryProductService } from '../inventory-product/inventory-product.service';
import { Product } from '../products/schemas/product.schemas';
import { Color } from 'src/color/schemas/color.schemas';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name)
    private cartModel: SoftDeleteModel<CartDocument>,
    private inventoryProductService: InventoryProductService
  ) { }
  create(user: IUser) {
    return this.cartModel.create({
      user: user._id,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
  }
  async findByUser(user: IUser) {
    const pop = [{
      path: "items.product",
      model: Product.name,
      select: "_id name price images "  // Lựa chọn chỉ lấy _id và tên sản phẩm
    }
    ]
    const re = await this.cartModel
      .findOne({ user: user._id })
      .select("-__v -updatedAt -createdAt -isDeleted -deletedAt")
      .populate(pop);
    return re;
  }
  async removeProductToCart(idProduct: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(idProduct)) {
      throw new BadRequestException(`not found cart with id=${idProduct}`);
    }
    const foundCart = await this.findByUser(user)
    let newitem = foundCart.items.filter((id: any) => !id.equals(idProduct));
    foundCart.items = newitem;
    await foundCart.save();

    return await this.calcTotal(foundCart?._id as any);
  }
  async removeAllCartItem(user: IUser) {
    const foundCart = await this.cartModel.findOneAndUpdate(
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
  async addProductToCart(cartItem: CartItem, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(cartItem.product._id)) {
      throw new BadRequestException(`not found cart with id=${cartItem.product._id}`);
    }

    const isStock = await this.inventoryProductService.checkProductAvailability(cartItem.product);
    const foundCart = await this.findByUser(user)
    //true -> empty
    const isItemExist = await this.checkIsItemExit(cartItem, foundCart.items)
    if (!isItemExist) {
      await this.cartModel.findOneAndUpdate(
        {
          user: user._id,
          items: { $elemMatch: { product: cartItem.product._id } },
        },
        {
          $set: {
            "items.$": {
              product: cartItem.product._id,
              color: cartItem.product?.color,
              quantity: cartItem.product.quantity,
              price: cartItem.product?.price,
              size: cartItem.product?.size,
            }
          },
        },
        { new: true },
      )
    }
    else {
      await this.cartModel.findByIdAndUpdate(
        foundCart._id,
        {
          $push: {
            items: {
              product: cartItem.product._id,
              color: cartItem.product?.color,
              quantity: cartItem.product.quantity,
              price: cartItem.product?.price,
              size: cartItem.product?.size,
            }
          },
        },
        { new: true },
      )
    }
    return await this.calcTotal(foundCart?._id as any);
  }




  //                        ==================Utils=================

  async checkIsItemExit(cartItem: CartItem, userProductCart: any) {
    // console.log("🚀 ~ CartsService ~ checkIsItemExit ~ userProductCart:", userProductCart)
    const itemExist = userProductCart.filter(item => {


      if (item.product) {
        // if (item.)
        if (item.product.equals(cartItem.product._id) && item?.color === cartItem?.product?.color && item?.size === cartItem?.product?.size)
          return true;
        if (
          item.product.equals(cartItem.product._id) &&
          (item.color !== cartItem.product.color || item.size !== cartItem.product.size)
        ) {
          return false;
        }

        return item.product.equals(cartItem.product._id);
      }
      return false
    });
    // console.log("🚀 ~ CartsService ~ checkIsItemExit ~ itemExist:", itemExist)
    return (itemExist.length === 0)
  }
  async calcTotal(cartId: string) {
    const found = await this.cartModel.findById(cartId);
    if (!found) throw new NotFoundException("Cart không tìm thấy");
    if (found.items.length === 0) {
      return await this.cartModel.
        findByIdAndUpdate(cartId, { $set: { total: 0 } }, { new: true });
    }
    const total = found.items.reduce((acc, cur: any) => {
      return acc + cur.price * cur.quantity
    }, 0);

    return await this.cartModel.
      findByIdAndUpdate(cartId, { $set: { total: total } }, { new: true });
  }


}

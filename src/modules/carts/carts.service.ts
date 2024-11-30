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

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name)
    private cartModel: SoftDeleteModel<CartDocument>,
    private productService: ProductsService,
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
    return await this.cartModel
      .findOne({ user: user._id })
      .select("-__v -updatedAt -createdAt");
  }
  async removeProductToCart(idProduct: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(idProduct)) {
      throw new BadRequestException(`not found cart with id=${idProduct}`);
    }
    const foundCart = await this.findByUser(user)

    await this.checkedItemInCart(user._id as any, idProduct as any);
    await this.cartModel.findOneAndUpdate(
      { user: user._id },
      {
        $pull: { items: { product: idProduct } }
      },
      { new: true }

    );
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

    const isStock = await this.checkIsProductStock(cartItem.product._id as any, cartItem)
    const foundCart = await this.findByUser(user)
    // if (!isStock) {
    //   throw new BadRequestException(`Sản phẩm ${cartItem.product.name} không đủ số lượng`)
    // }
    //true -> empty
    const isItemExist = await this.checkIsItemExit(cartItem.product._id as any, foundCart.items)
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
              name: cartItem.product.name,
              quantity: cartItem.product.quantity,
              price: cartItem.product.price,
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
              name: cartItem.product.name,
              quantity: cartItem.product.quantity,
              price: cartItem.product.price,
            }
          },
        },
        { new: true },
      )
    }
    return await this.calcTotal(foundCart?._id as any);
  }




  //                        ==================Utils=================
  async checkIsProductStock(productId: Types.ObjectId, cartItem: CartItem | UpdateToCartDto) {
    const productStock = (await this.inventoryProductService.findByProductId(productId as any)).quantity;
    return productStock >= cartItem.product.quantity
  }
  async checkIsItemExit(productId: mongoose.Types.ObjectId, userProductCart: any) {
    const itemExist = userProductCart.filter(item => {
      if (item.product) {
        return item.product.equals(productId)
      }
      return false
    });
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
  async checkedItemInCart(userId: Types.ObjectId, proId: Types.ObjectId) {
    const isItemExist = await this.cartModel.findOne({
      user: userId,
      "items.product": proId,
    })
    if (!isItemExist) throw new BadRequestException("Product does not exist in the cart.");
  }
  // findAll() {
  //   return `This action returns all carts`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} cart`;
  // }

  // update(id: number,) {
  //   return `This action updates a #${id} cart`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} cart`;
  // }
}

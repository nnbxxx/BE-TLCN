import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartItem, UpdateToCartDto } from './dto/update-cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';

@ApiTags('carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }
  @ResponseMessage("Create a new Cart User")
  @Post('/create')
  create(@User() user: IUser) {
    return this.cartsService.create(user);
  }

  @ResponseMessage("Get Cart User")
  @Get('/user')
  getCartByUser(@User() user: IUser) {
    return this.cartsService.findByUser(user);
  }

  @ResponseMessage("Add product to Cart User")
  @Post('/add')

  addItem(@User() user: IUser, @Body() CartItem: CartItem) {
    return this.cartsService.addProductToCart(CartItem, user);
  }

  @ResponseMessage("Update product to Cart User")
  @Post('/update')
  updateItem(@User() user: IUser, @Body() updateCartDto: CartItem) {
    return this.cartsService.addProductToCart(updateCartDto, user);
  }

  @ResponseMessage("Delete product to Cart User")
  @Delete(':id')
  removeCartItem(@Param('id') id: string, @User() user: IUser) {
    return this.cartsService.removeProductToCart(id, user);
  }
  @ResponseMessage("Remove All Cart User")
  @Post('/remove')
  removeCart(@User() user: IUser) {
    return this.cartsService.removeAllCartItem(user);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LikeProductsService } from './like-products.service';
import { CreateLikeProductDto } from './dto/create-like-product.dto';
import { ProductLikeItem, UpdateLikeProductDto } from './dto/update-like-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
@ApiTags('like-products')
@Controller('like-products')
export class LikeProductsController {
  constructor(private readonly likeProductsService: LikeProductsService) { }
  @ResponseMessage("Create a new LikeProducts User")
  @Post('/create')
  create(@User() user: IUser) {
    return this.likeProductsService.create(user);
  }
  @ResponseMessage("Get LikeProducts User")
  @Get('/user')
  getCartByUser(@User() user: IUser) {
    return this.likeProductsService.findByUser(user);
  }
  @ResponseMessage("Add product to Cart User")
  @Post('/add')
  addItem(@User() user: IUser, @Body() productLikeItem: ProductLikeItem) {
    return this.likeProductsService.addProduct(productLikeItem, user);
  }


  @ResponseMessage("Delete product to Cart User")
  @Delete(':id')
  removeCartItem(@Param('id') id: string, @User() user: IUser) {
    return this.likeProductsService.removeProduct(id, user);
  }
  @ResponseMessage("Check product to is like")
  @Get('/user/:id')
  checkCartItem(@Param('id') id: string, @User() user: IUser) {
    return this.likeProductsService.checkProductFavorite(id, user);
  }
  @ResponseMessage("Remove All Cart User")
  @Post('/remove')
  removeCart(@User() user: IUser) {
    return this.likeProductsService.removeAll(user);
  }


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.likeProductsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLikeProductDto: UpdateLikeProductDto) {
  //   return this.likeProductsService.update(+id, updateLikeProductDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.likeProductsService.remove(+id);
  // }
}

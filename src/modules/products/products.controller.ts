import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IUser } from '../users/users.interface';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @ResponseMessage("Create a new Product")
  create(@Body() createProductDto: CreateProductDto, @User() user: IUser) {
    return this.productsService.create(createProductDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage("Fetch Product with paginate")
  findAll(@Query("current") currentPage: number,
    @Query("pageSize") limit: number,
    @Query() qs: string,) {
    return this.productsService.findAll(currentPage, limit, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage("Fetch Product by id for non-members")
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id as any);
  }
  @Get('/user/:id')
  @ResponseMessage("Fetch Product by id for members")
  findOneForUser(@Param('id') id: string, @User() user: IUser) {
    this.productsService.getProductsRecentViewByUser(user);
    return this.productsService.findOneForUser(id as any, user);
  }
  @Get('/images/:id')
  @ResponseMessage("Fetch Product by id for members")
  findImages(@Param('id') id: string) {

    return this.productsService.findImages(id as any);
  }
  @Get('/product/recent')
  @ResponseMessage("Fetch Products Recent View for members")
  findProductsRecentViewForUser(@User() user: IUser) {
    return this.productsService.getProductsRecentViewByUser(user);;
  }
  @Get('/product/purchased')
  @ResponseMessage("Fetch Products Purchased  for members")
  findProductsPurchasedForUser(@User() user: IUser) {
    return this.productsService.getProductsPurchasedByUser(user);;
  }

  @ResponseMessage("Update a Product")
  @Patch()
  update(@Body() updateProductDto: UpdateProductDto, @User() user: IUser) {
    return this.productsService.update(updateProductDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a Product")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.productsService.remove(id, user);
  }
}

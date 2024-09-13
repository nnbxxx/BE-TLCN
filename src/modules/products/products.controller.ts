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

  @Get()
  @ResponseMessage("Fetch Product with paginate")
  findAll(@Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,) {
    return this.productsService.findAll();
  }

  @Public()
  @Get(':id')
  @ResponseMessage("Fetch Product by id")
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
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

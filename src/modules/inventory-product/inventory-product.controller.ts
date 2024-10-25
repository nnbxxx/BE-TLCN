import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InventoryProductService } from './inventory-product.service';
import { CreateInventoryProductDto } from './dto/create-inventory-product.dto';
import { UpdateInventoryProductDto } from './dto/update-inventory-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';

@ApiTags('inventory-product')
@Controller('inventory-product')
export class InventoryProductController {
  constructor(private readonly inventoryProductService: InventoryProductService) { }
  @ResponseMessage("Create a new InventoryProduct")
  @Post()
  create(@Body() createInventoryProductDto: CreateInventoryProductDto, @User() user: IUser) {
    return this.inventoryProductService.create(createInventoryProductDto, user);
  }

  @Get()
  @ResponseMessage("Fetch InventoryProduct with paginate")
  findAll(@Query("current") currentPage: number,
    @Query("pageSize") limit: number,
    @Query() qs: string,) {
    return this.inventoryProductService.findAll(currentPage, limit, qs);
  }

  @Get(':id')
  @ResponseMessage("Fetch InventoryProduct by id ")
  findOne(@Param('id') id: string) {
    return this.inventoryProductService.findOne(id as any);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventoryProductDto: UpdateInventoryProductDto) {
    return this.inventoryProductService.update(+id, updateInventoryProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryProductService.remove(+id);
  }
}

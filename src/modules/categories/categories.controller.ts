import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @ResponseMessage("Create a new Category")
  create(@Body() createCategoryDto: CreateCategoryDto, @User() user: IUser) {
    return this.categoriesService.create(createCategoryDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage("Fetch Product with paginate")
  findAll(@Query("current") currentPage: number,
    @Query("pageSize") limit: number,
    @Query() qs: string,) {
    return this.categoriesService.findAll(currentPage, limit, qs);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.categoriesService.findOne(+id);
  // }

  @Patch()
  update( @Body() updateCategoryDto: UpdateCategoryDto,@User() user: IUser) {
    return this.categoriesService.update( updateCategoryDto,user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a Product")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.categoriesService.remove(id, user);
  }
}

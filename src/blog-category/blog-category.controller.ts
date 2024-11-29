import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BlogCategoryService } from './blog-category.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/modules/users/users.interface';

@ApiTags('blog-category')
@Controller('blog-category')
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) { }
  @ResponseMessage("Create a new BlogCategory")
  @Post()
  create(@Body() createBlogCategoryDto: CreateBlogCategoryDto, @User() user: IUser) {
    return this.blogCategoryService.create(createBlogCategoryDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage("Fetch BlogCategory with paginate")
  findAll(@Query("current") currentPage: number,
    @Query("pageSize") limit: number,
    @Query() qs: string,) {
    return this.blogCategoryService.findAll(currentPage, limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogCategoryService.findOne(id);
  }

  @ResponseMessage("Update a BlogCategory")
  @Patch()
  update(@Body() updateBlogCategoryDto: UpdateBlogCategoryDto, @User() user: IUser) {
    return this.blogCategoryService.update(updateBlogCategoryDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a BlogCategory")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.blogCategoryService.remove(id, user);
  }
  
}

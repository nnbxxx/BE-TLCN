import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }
  @ResponseMessage("Create a new Blog")
  @Post()
  create(@Body() createBlogDto: CreateBlogDto, @User() user: IUser) {
    return this.blogService.create(createBlogDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage("Fetch Brand with paginate")
  findAll(@Query("current") currentPage: number,
    @Query("pageSize") limit: number,
    @Query() qs: string,) {
    return this.blogService.findAll(currentPage, limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @ResponseMessage("Update a Blog")
  @Patch()
  update(@Body() updateBlogDto: UpdateBlogDto, @User() user: IUser) {
    return this.blogService.update(updateBlogDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a blog")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.blogService.remove(id, user);
  }

}

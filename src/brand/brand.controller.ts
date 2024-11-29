import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/modules/users/users.interface';
@ApiTags('brand')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }


  @ResponseMessage("Create a new Brand")
  @Post()
  create(@Body() createBrandDto: CreateBrandDto, @User() user: IUser) {
    return this.brandService.create(createBrandDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage("Fetch Brand with paginate")
  findAll(@Query("current") currentPage: number,
    @Query("pageSize") limit: number,
    @Query() qs: string,) {
    return this.brandService.findAll(currentPage, limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @ResponseMessage("Update a Brand")
  @Patch()
  update(@Body() updateBrandDto: UpdateBrandDto, @User() user: IUser) {
    return this.brandService.update(updateBrandDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a brand")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.brandService.remove(id, user);
  }
}

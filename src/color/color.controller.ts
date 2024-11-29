import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/modules/users/users.interface';
@ApiTags('color')
@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) { }

  @ResponseMessage("Create a new color")
  @Post()
  create(@Body() createColorDto: CreateColorDto, @User() user: IUser) {
    return this.colorService.create(createColorDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage("Fetch color with paginate")
  findAll(@Query("current") currentPage: number,
    @Query("pageSize") limit: number,
    @Query() qs: string,) {
    return this.colorService.findAll(currentPage, limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colorService.findOne(id);
  }
  @ResponseMessage("Update a color")
  @Patch()
  update(@Body() updateColorDto: UpdateColorDto, @User() user: IUser) {
    return this.colorService.update(updateColorDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a color")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.colorService.remove(id, user);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AddressUserService } from './address-user.service';
import { CreateAddressUserDto } from './dto/create-address-user.dto';
import { UpdateAddressUserDto } from './dto/update-address-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
@ApiTags('address-user')
@Controller('address-user')
export class AddressUserController {
  constructor(private readonly addressUserService: AddressUserService) { }

  @Post()
  @ResponseMessage("Create a new user address")
  create(@Body() createAddressUserDto: CreateAddressUserDto, @User() user: IUser) {
    return this.addressUserService.create(createAddressUserDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage("Fetch list address user with paginate")
  findAll(@Query("current") currentPage: number,
    @Query("pageSize") limit: number,
    @Query() qs: string) {
    return this.addressUserService.findAll(currentPage, limit, qs)
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressUserService.findOne(+id);
  }
  @Get('/user/default-address')
  @ResponseMessage("Get default address user")
  findDefaultAddress(@User() user: IUser) {
    return this.addressUserService.findDefaultAddress(user);
  }

  @Patch(':id')
  @ResponseMessage("Update address user ")
  update(@Param('id') id: string, @Body() updateAddressUserDto: UpdateAddressUserDto, @User() user: IUser) {
    return this.addressUserService.update(updateAddressUserDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressUserService.remove(+id);
  }
}

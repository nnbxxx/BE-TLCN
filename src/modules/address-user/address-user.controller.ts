import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AddressUserService } from './address-user.service';
import { CreateAddressUserDto } from './dto/create-address-user.dto';
import { UpdateAddressUserDto, UpdateAddressUserDtoSWG } from './dto/update-address-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
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


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.addressUserService.findOne(+id);
  // }
  @Get('/user/default-address')
  @ResponseMessage("Get default address user")
  findDefaultAddress(@User() user: IUser) {
    return this.addressUserService.findDefaultAddress(user);
  }
  @Get('/user/:id')
  @ResponseMessage("Get default address user")
  findAddressUserById(@User() user: IUser, @Param('id') id: string) {
    return this.addressUserService.findUserAddress(user, id);
  }

  @Patch()
  @ApiBody({ type: UpdateAddressUserDtoSWG })
  @ResponseMessage("Update address user ")
  update(@Body() updateAddressUserDto: UpdateAddressUserDto, @User() user: IUser) {
    return this.addressUserService.update(updateAddressUserDto);
  }
  @Patch('/user')
  @ApiBody({ type: UpdateAddressUserDtoSWG })
  @ResponseMessage("Update address user ")
  updateAddressUser(@Body() updateAddressUserDto: UpdateAddressUserDto, @User() user: IUser) {
    return this.addressUserService.updateUser(updateAddressUserDto, user);
  }
  @Patch('/user/default/:id')
  @ResponseMessage("Update address user ")
  updateDefaultAddress(@User() user: IUser, @Param('id') id: string) {
    return this.addressUserService.updateDefaultAddressUser(id, user);
  }

  @Delete('/user/remove/:id')
  @ResponseMessage("Delete address user for user")
  remove(@User() user: IUser, @Param('id') id: string) {
    return this.addressUserService.removeForUser(id, user);
  }
}

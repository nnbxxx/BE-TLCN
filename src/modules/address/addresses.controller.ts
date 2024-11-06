import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AddressService } from './addresses.service';
import { CreateAddressDto, CreateAddressMultipleDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { log } from 'console';

@ApiTags('address')
@Controller('address')
@Public()
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  // @Post()
  // @ResponseMessage("Create new a Address")
  // create(@Body() createAddressDto: CreateAddressDto) {
  //   return this.addressService.create(createAddressDto);
  // }
  // @Post('/multiple')
  // @ResponseMessage("Create multiple Addresses")
  // createMultiple(@Body() createAddressMultipleDto: CreateAddressMultipleDto) {
  //   return this.addressService.createMultiple(createAddressMultipleDto);
  // }

  // @Get()
  // @ResponseMessage("Fetch Address with paginate")
  // findAll(@Query("current") currentPage: number,
  //   @Query("pageSize") limit: number,
  //   @Query() qs: string,) {
  //   return this.addressService.findAll(currentPage, limit, qs);
  // }

  @Get('/province')
  @ResponseMessage("Fetch Province ")
  findProvince() {
    return this.addressService.getProvince();
  }
  @Get('/district')
  @ResponseMessage("Fetch Districts by province")
  findDistricts(@Query('idProvince') idProvince: string) {
    return this.addressService.getDistrictsByCityId(idProvince);
  }
  @Get('/ward')
  @ResponseMessage("Fetch Ward by Districts")
  findWards(@Query('provinceId') provinceId: string, @Query('districtId') districtId: string) {
    return this.addressService.getWardByCityId(provinceId, districtId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
  //   return this.addressService.update(+id, updateAddressDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.addressService.remove(+id);
  // }
}

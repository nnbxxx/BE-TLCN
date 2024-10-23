import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { Cron, CronExpression } from '@nestjs/schedule';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) { }
  @ResponseMessage("Create a new coupon")
  @Post()
  create(@Body() createCouponDto: CreateCouponDto, @User() user: IUser) {
    return this.couponsService.create(createCouponDto, user);
  }

  @Get()
  @ResponseMessage("Fetch Coupons with paginate")
  findAll(@Query("current") currentPage: number,
    @Query("pageSize") limit: number,
    @Query() qs: string,) {
    return this.couponsService.findAll(currentPage, limit, qs);
  }

  @Get(':id')
  @ResponseMessage("Fetch Coupons by id ")
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id as any);
  }
  @ResponseMessage("Update a Coupons")
  @Patch(':id')
  update(@Body() updateCouponDto: UpdateCouponDto, @User() user: IUser) {
    return this.couponsService.update(updateCouponDto, user);
  }
  @ResponseMessage("Delete a Coupons")
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.couponsService.remove(id, user);
  }

  //auto send notification to user
  @ResponseMessage("auto send notification accept coupons to user")
  @Get('/user/auto_notification_coupons')
  @Public()
  @Cron(CronExpression.EVERY_5_MINUTES)
  autoSendNotificationCouponsToUser() {
    return this.couponsService.autoNotificationCoupons();
  }
}

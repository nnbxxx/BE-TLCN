import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { IdSW, UpdateReceiptDto } from './dto/update-receipt.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailSW } from '../users/dto/update-user.dto';
import { CheckValidCoupon } from '../coupons/dto/create-coupon.dto';

@ApiTags('receipts')
@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) { }
  @ResponseMessage("Create new receipt")
  @Post()
  create(@Body() createReceiptDto: CreateReceiptDto, @User() user: IUser) {
    return this.receiptsService.create(createReceiptDto, user);

  }
  @ResponseMessage("active coupon of receipt")
  @Post(`coupon/active/:id`)
  activeCoupon(@Body() checkValidCoupon: CheckValidCoupon, @Param('id') id: string, @User() user: IUser) {
    return this.receiptsService.activeCoupons(checkValidCoupon, id, user);
  }
  @ResponseMessage("active coupon of receipt")
  @Post(`coupon/unactive/:id`)
  unactiveCoupon(@Body() checkValidCoupon: CheckValidCoupon, @Param('id') id: string, @User() user: IUser) {
    return this.receiptsService.activeCoupons(checkValidCoupon, id, user, false);
  }

  @ResponseMessage("View history receipt")
  @Get()
  findAllByUser(@Query("current") currentPage: number,
    @Query("pageSize") limit: number,
    @Query() qs: string, @User() user: IUser) {
    return this.receiptsService.findAll(currentPage, limit, qs, user);
  }
  @ResponseMessage("View detail receipt")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receiptsService.findOne(id);
  }
  @ResponseMessage("Update receipt for user")
  @Patch()
  update(@Body() updateReceiptDto: UpdateReceiptDto) {
    return this.receiptsService.updateForUser(updateReceiptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.receiptsService.removeForUser(id, user);
  }

  @ResponseMessage("auto confirm receipts")
  @Get('auto/auto_active')
  @Public()
  @Cron(CronExpression.EVERY_MINUTE)
  autoUpdateConfirm() {
    // console.log("🚀 ~ ReceiptsController ~ autoUpdateConfirm ~ autoUpdateConfirm")
    return this.receiptsService.autoconfirm();
  }

  @ResponseMessage("confirmPayment receipts")
  @Post('/confirmPayment')
  @ApiBody({ type: IdSW })
  confirmPayment(@Body("id") id: string, @User() user: IUser) {
    // console.log("🚀 ~ ReceiptsController ~ autoUpdateConfirm ~ autoUpdateConfirm")
    return this.receiptsService.confirmPayment(id, user);
  }
  @ResponseMessage("return receipts")
  @Post('/user/return')
  @ApiBody({ type: IdSW })
  returnReceipt(@Body("id") id: string, @User() user: IUser) {
    return this.receiptsService.returnReceipt(id, user);
  }

  @Get('/user/cash-flow')
  @ResponseMessage("Cash flow statistics a User")
  getCashFlow(@User() user: IUser) {
    return this.receiptsService.getCashFlow(user);
  }
}

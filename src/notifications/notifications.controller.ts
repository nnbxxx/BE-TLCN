import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { Public, ResponseMessage, User } from 'src/decorator/customize';

import { ApiBody, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { IUser } from 'src/modules/users/users.interface';
import { NotificationsGateway } from './notifications.gateway';


// dành cho admin
@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway
  ) { }

  @Post()
  @ResponseMessage("Create a new Notification")
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    this.notificationsGateway.sendNotification(createNotificationDto)
    return await this.notificationsService.create(createNotificationDto)
  }

  @Get()
  @ResponseMessage("Fetch Notification with paginate")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,) {
    return this.notificationsService.findAll(+currentPage, +limit, qs);
  }
  // @Public()
  // @Get('/user')
  // @ResponseMessage("Fetch Notification by user id")
  // async findOne() {
  //   return await this.notificationsService.getNotificationsByUser('6714d2f111177e659cd9743c');

  // }
  @Get('/user')
  @ResponseMessage("Fetch Notification by user id")
  async findOne(@User() user: IUser) {
    return await this.notificationsService.getNotificationsByUser(user._id);

  }
  // API để đánh dấu thông báo đã đọc
  // @Public()
  @Patch('mark-as-read/:notificationId')
  async markAsRead(@Param('notificationId') notificationId: string, @User() user: IUser) {
    return await this.notificationsService.markAsRead(notificationId, user);
  }


}

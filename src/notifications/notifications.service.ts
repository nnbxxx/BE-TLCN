import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schemas';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { IUser } from 'src/modules/users/users.interface';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel('Notification') private notificationModel: SoftDeleteModel<NotificationDocument>) { }
  async create(createNotificationDto: CreateNotificationDto) {
    const { message, title, userId, navigate } = createNotificationDto
    const oldNotification = await this.notificationModel.findOne({
      userId: userId,
      title: title,
      message: message,
      navigate: navigate
    });
    if (oldNotification) return oldNotification
    return await this.notificationModel.create({
      message, title, userId
    });;
  }
  async getNotificationsByUser(userId: string) {
    return await this.notificationModel.find({}).exec();
    // return await this.notificationModel.find({ userId }).sort({ createdAt: -1 });
  }
  async markAsRead(notificationId: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      throw new BadRequestException(`not found notification with id=${notificationId}`);
    }
    return await this.notificationModel.findOneAndUpdate({ _id: notificationId, userId: user._id }, { isRead: true }, { new: true });
  }
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;


    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.notificationModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.notificationModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('')
      .populate(population)
      .exec();


    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }

  }

  // findOne(id: number) {
  //   return `This action returns a #${id} notification`;
  // }

  // update(id: number, updateNotificationDto: UpdateNotificationDto) {
  //   return `This action updates a #${id} notification`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} notification`;
  // }

  // async sendNotificationCouponToUsers(listUser: [{ point: number, _id: any, couponsUser: [{}] }], coupon: {
  //   _id: any, code: string, description: {}
  // }) {

  // }
}

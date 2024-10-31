import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './schemas/review.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { IUser } from '../users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: SoftDeleteModel<ReviewDocument>, private userService: UsersService
  ) { }
  async create(user: IUser, createReviewDto: CreateReviewDto) {
    const { comment, productId, rating, userId, fileUrl } = createReviewDto
    const checkProduct = await this.userService.checkPurchasedProduct(userId as any, productId as any)
    if (!checkProduct) {
      throw new BadRequestException('User has not purchased this product');
    }
    let newReview = await this.reviewModel.create({
      comment, productId, rating, userId, fileUrl,
      createdBy: {
        _id: userId,
        email: user.email

      }
    })
    return newReview;
  }

  async getQuantityComment(productId: string) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new NotFoundException(`not found product with id=${productId}`);
    }
    return this.reviewModel.countDocuments({ productId }).exec();
  }
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;


    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.reviewModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.reviewModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select([''])
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

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }


}

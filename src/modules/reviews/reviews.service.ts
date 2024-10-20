import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './schemas/review.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { IUser } from '../users/users.interface';

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

  findAll() {
    return `This action returns all reviews`;
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

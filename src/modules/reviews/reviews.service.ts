import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './schemas/review.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { IUser } from '../users/users.interface';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import { Product, ProductDocument } from '../products/schemas/product.schemas';
import { ProductsService } from '../products/products.service';
import { ReceiptsService } from '../receipts/receipts.service';
import { Receipt, ReceiptDocument } from '../receipts/schemas/receipt.schemas';
import { RECEIPT_STATUS } from 'src/constants/schema.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: SoftDeleteModel<ReviewDocument>,
    // @Inject(forwardRef(() => ProductsService))
    @InjectModel(Product.name)
    private productModel: SoftDeleteModel<ProductDocument>,
    // @Inject(forwardRef(() => ReceiptsService))
    @InjectModel(Receipt.name)
    private receiptModel: SoftDeleteModel<ReceiptDocument>,

    private userService: UsersService
  ) { }
  async create(user: IUser, createReviewDto: CreateReviewDto) {
    const { comment, productId, rating, userId, fileUrl } = createReviewDto
    const checkProduct = await this.userService.checkPurchasedProduct(userId as any, productId as any)
    if (!checkProduct) {
      throw new BadRequestException('User has not purchased this product');
    }
    await this.validateReview(user._id, createReviewDto.productId as any);
    let newReview = await this.reviewModel.create({
      comment, productId, rating, userId, fileUrl,
      createdBy: {
        _id: userId,
        email: user.email

      }
    })
    //UPDATE RATING PRODUCT
    await this.updateProductRating(productId as any);
    return newReview;
  }
  async updateProductRating(productId: string) {
    const ratings = await this.reviewModel.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: null, avgRating: { $avg: { $toInt: '$rating' } } } },
    ]);

    const avgRating = ratings.length > 0 ? ratings[0].avgRating : 0;

    // Cập nhật lại sản phẩm
    await this.productModel.findByIdAndUpdate(productId, { rating: avgRating });
  }
  async validateReview(userId: string, productId: string) {


    // 1. Đếm số lần user đã review sản phẩm này
    const existingReviewsCount = await this.reviewModel.countDocuments({
      userId,
      productId,
      isDeleted: false,
    });
    console.log("🚀 ~ ReviewsService ~ validateReview ~ existingReviewsCount:", existingReviewsCount)

    // 2. Đếm số lượng đơn hàng "completed" chứa sản phẩm này
    const completedOrdersCount = await this.receiptModel.countDocuments({
      user: userId,
      'items.product': productId,
      statusUser: RECEIPT_STATUS.DELIVERED,
      isCheckout: true
    });
    console.log("🚀 ~ ReviewsService ~ validateReview ~ completedOrdersCount:", completedOrdersCount)

    // 3. Cho phép review nếu số lần review nhỏ hơn số đơn "completed"
    if (existingReviewsCount >= completedOrdersCount && completedOrdersCount != 0 && existingReviewsCount != 0) {
      throw new BadRequestException(
        `Bạn đã review đủ số lần tương ứng với các đơn hàng đã hoàn thành. Vui long mua lại sản phẩm để reviews`,
      );
    }
    //    return newReview;
  }

  async getQuantityComment(productId: string) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new NotFoundException(`not found review with id=${productId}`);
    }
    return this.reviewModel.countDocuments({ productId }).exec();
  }
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;


    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 1000;

    const totalItems = (await this.reviewModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.reviewModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select([''])
      // .populate(population)
      .populate({
        path: 'userId',
        select: 'name avatar', // Chỉ chọn các trường name và images từ product
      })
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
  //   return `This action returns a #${id} review`;
  // }

  // update(id: number, updateReviewDto: UpdateReviewDto) {
  //   return `This action updates a #${id} review`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} review`;
  // }


}

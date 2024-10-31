import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '../users/users.interface';
import mongoose, { Types } from 'mongoose';
import aqp from 'api-query-params';
import { UsersService } from '../users/users.service';
import { InventoryProductService } from '../inventory-product/inventory-product.service';
import { CreateInventoryProductDto } from '../inventory-product/dto/create-inventory-product.dto';
import { ReviewsService } from '../reviews/reviews.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: SoftDeleteModel<ProductDocument>,
    private userService: UsersService,
    private inventoryProductService: InventoryProductService,
    private reviewService: ReviewsService
  ) { }

  async create(createProductDto: CreateProductDto, user: IUser) {
    const { brand, category, description, images, name, price, shopName, quantity } = createProductDto
    const product = await this.productModel.create({
      brand, category, description, images, name, price, shopName,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    const inventoryProductDto: CreateInventoryProductDto = {
      productId: product._id as any,
      quantity: quantity,
      reservations: []
    }
    await this.inventoryProductService.create(inventoryProductDto, user)
    return product;

  }

  async findAll(currentPage: number, limit: number, qs: string) {

    const { filter, sort, population } = aqp(qs);
    const { min, max } = filter

    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.productModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    let result;
    if (min >= 0 && max >= 0) {
      result = await this.productModel.find({
        price: { $gte: min, $lte: max }
      })
        .skip(offset)
        .limit(defaultLimit)
        .sort(sort as any)
        .select([''])
        .populate(population)
        .exec();
    }
    else {
      result = await this.productModel.find(filter)
        .skip(offset)
        .limit(defaultLimit)
        .sort(sort as any)
        .select([''])
        .populate(population)
        .exec();
    }
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


  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found product with id=${id}`);
    }
    const data = await this.productModel.findById(id);
    const quantityComments = await this.reviewService.getQuantityComment(id as any)
    const productPurchased = await this.inventoryProductService.getProductPurchased(id as any) as any
    const { _id, reservations } = productPurchased
    const newData = { ...data.toObject(), quantityComments: +quantityComments, quantityProductPurchased: reservations.length }
    return newData;
  }
  async findOneForUser(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found product with id=${id}`);
    }
    this.userService.updateRecentViewProduct(user, id as any);
    return await this.productModel.findById(id);
  }

  async update(updateProductDto: UpdateProductDto, user: IUser) {

    return await this.productModel.updateOne(
      { _id: updateProductDto._id },
      {
        ...updateProductDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found product with id=${id}`); // status: 200 => 400
    }
    await this.productModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.productModel.softDelete({ _id: id });
  }
}

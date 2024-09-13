import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '../users/users.interface';
import mongoose from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: SoftDeleteModel<ProductDocument>
  ) { }

  create(createProductDto: CreateProductDto, user: IUser) {
    return this.productModel.create({
      ...createProductDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

  }

  findAll() {
    return `This action returns all products`;
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found product with id=${id}`); // status: 200 => 400
    }
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

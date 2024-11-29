import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BlogCategory, BlogCategoryDocument } from './schemas/blog-category.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/modules/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class BlogCategoryService {
  constructor(
    @InjectModel(BlogCategory.name)
    private blogCategoryModel: SoftDeleteModel<BlogCategoryDocument>,
  ) { }
  create(createBlogCategoryDto: CreateBlogCategoryDto, user: IUser) {
    return this.blogCategoryModel.create({
      ...createBlogCategoryDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

  }
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;


    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.blogCategoryModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.blogCategoryModel.find(filter)
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found product with id=${id}`);
    }
    return await this.blogCategoryModel.findById(id);
  }


  async update(updateBlogCategoryDto: UpdateBlogCategoryDto, user: IUser) {

    return await this.blogCategoryModel.updateOne(
      { _id: updateBlogCategoryDto._id },
      {
        ...updateBlogCategoryDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found category with id=${id}`); // status: 200 => 400
    }
    await this.blogCategoryModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.blogCategoryModel.softDelete({ _id: id });
  }

}

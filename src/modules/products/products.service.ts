import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { CategoriesService } from '../categories/categories.service';
import { User, UserDocument } from '../users/schemas/user.schema';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: SoftDeleteModel<ProductDocument>,
    private userService: UsersService,
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
    private inventoryProductService: InventoryProductService,
    @Inject(forwardRef(() => ReviewsService))
    private reviewService: ReviewsService,
    private categoriesService: CategoriesService,
    private notificationsGateway: NotificationsGateway,
    private notificationsService: NotificationsService,
  ) { }

  async create(createProductDto: CreateProductDto, user: IUser) {
    const {
      brand,
      category,
      description,
      images,
      name,
      tags,
      features,
      variants,
    } = createProductDto;

    // Tạo sản phẩm mới
    const product = await this.productModel.create({
      brand,
      category,
      description,
      images,
      name,
      tags,
      features,
      variants,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    // Biến đổi dữ liệu các biến thể (variants) theo các thuộc tính động trong features
    let dataVariants: any[];
    if (variants && variants.length) {
      dataVariants = variants.map((variant: any) => {
        const variantData: any = {}; // Đối tượng lưu trữ thông tin biến thể

        // Kiểm tra các thuộc tính trong features và lấy giá trị tương ứng từ variant
        if (features.includes('color') && variant.attributes.color) {
          variantData.color = variant.attributes.color.name;
        }
        if (features.includes('size') && variant.attributes.size) {
          variantData.size = variant.attributes.size.name;
        }
        if (features.includes('material') && variant.attributes.material) {
          variantData.material = variant.attributes.material.name;
        }
        variantData.importPrice = 0;
        variantData.exportPrice = 0;
        variantData.stock = 0;
        variantData.sellPrice = 0;
        return variantData;
      });
    }
    else {
      dataVariants = [{ importPrice: 0, exportPrice: 0, stock: 0, sellPrice: 0 }]
    }

    // Biến đổi dữ liệu từ productDto sang CreateInventoryProductDto
    const inventoryProductDto: CreateInventoryProductDto = {
      productId: product._id.toString(), // Lấy _id của sản phẩm vừa tạo
      productVariants: dataVariants,
    };

    // Tạo kho (inventory) cho sản phẩm vừa tạo
    await this.inventoryProductService.create(inventoryProductDto, user);

    // Gửi thông báo về sản phẩm mới
    await this.sendNewProductNotification(product);

    return product;
  }

  async sendNewProductNotification(product) {
    const listUser = await this.userModel.find({}, '_id').exec();
    listUser.forEach(async (user) => {
      this.notificationsService.create({
        message: `Có sản phẩm mới: ${product.name}`,
        title: `Có sản phẩm mới: ${product.name}`,
        userId: user as any,
        navigate: `${process.env.FE_URI}product/${product._id}`,
      });
      const connectSocketId = await this.userService.checkConnectSocketIo(
        user as any,
      );
      if (connectSocketId !== null) {
        this.notificationsGateway.sendNotification(
          {
            message: `Có sản phẩm mới: ${product.name}`,
            title: `Có sản phẩm mới: ${product.name}`,
            userId: user as any,
          },
          connectSocketId as any,
        );
      }
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 1000;

    const totalItems = (await this.productModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    let result = await this.productModel
      .find(filter)
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
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid product ID: ${id}`);
    }

    // Tìm sản phẩm và populate màu
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Lấy thông tin từ các service khác
    const productInventory =
      await this.inventoryProductService.findByProductId(id);
    const quantityComments = await this.reviewService.getQuantityComment(id);
    const productPurchased =
      (await this.inventoryProductService.getProductPurchased(id)) as any;

    const { reservations = [] } = productPurchased || {};
    const quantityProductPurchased = Array.isArray(reservations)
      ? reservations.length
      : 0;

    // Chuẩn bị dữ liệu trả về
    const newData = {
      ...product.toObject(),
      // colors: product.colors, // Thay thế ID của màu bằng thông tin chi tiết (mã màu hoặc tên)
      quantityComments: +quantityComments,
      quantityProductPurchased,
      //quantity: productInventory?.quantity || 0,
    };

    return newData;
  }

  async findOneForUser(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found product with id=${id}`);
    }
    this.userService.updateRecentViewProduct(user, id as any);
    const data = await this.productModel
      .findById(id)
      .populate({
        path: 'colors', // Trường colors tham chiếu đến bảng Color
        select: 'color', // Chỉ lấy mã màu từ bảng Color
      })
      .exec();
    const productInventory =
      await this.inventoryProductService.findByProductId(id);
    const quantityComments = await this.reviewService.getQuantityComment(
      id as any,
    );
    const productPurchased =
      (await this.inventoryProductService.getProductPurchased(
        id as any,
      )) as any;
    const { _id, reservations } = productPurchased;
    const newData = {
      ...data.toObject(),
      quantityComments: +quantityComments,
      quantityProductPurchased: reservations.length,
      // quantity: productInventory.quantity,
    };
    return newData;
  }
  async findImages(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found product with id=${id}`);
    }
    const data = await this.productModel.findById(id);
    return data.images;
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
  async getProductsRecentViewByUser(user: IUser) {
    const userDB = (await this.userService.findOne(user._id)) as any;
    return this.productModel
      .find({ _id: { $in: userDB.recentViewProducts } })
      .select(['_id', 'name', 'price', 'images'])
      .exec();
  }
  async getProductsPurchasedByUser(user: IUser) {
    const userDB = (await this.userService.findOne(user._id)) as any;
    return this.productModel
      .find({ _id: { $in: userDB.purchasedProducts } })
      .select(['_id', 'name', 'price', 'images'])
      .exec();
  }
}

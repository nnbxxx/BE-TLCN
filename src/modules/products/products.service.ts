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
import { InventoryProduct, InventoryProductDocument } from '../inventory-product/schemas/inventory-product.schemas';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(InventoryProduct.name)
    private inventoryProductModel: SoftDeleteModel<InventoryProductDocument>,
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
      code
    } = createProductDto;
    const existingProduct = await this.productModel.findOne({ code });
    if (existingProduct) {
      throw new BadRequestException('Mã sản phẩm (code) đã tồn tại.');
    }
    // Tạo sản phẩm mới
    const product = await this.productModel.create({
      brand,
      category,
      description,
      images,
      name,
      tags,
      features,
      variants, code,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    // Biến đổi dữ liệu các biến thể (variants) theo các thuộc tính động trong features
    let dataVariants: any[];
    if (variants && variants.length) {
      dataVariants = variants.map((variant: any) => {
        const variantData: any = {
          attributes: {
          } as any
        }; // Đối tượng lưu trữ thông tin biến thể

        // Kiểm tra các thuộc tính trong features và lấy giá trị tương ứng từ variant
        if (features.includes('color') && variant.attributes.color) {
          variantData.attributes.color = variant.attributes.color.name;
        }
        if (features.includes('size') && variant.attributes.size) {
          variantData.attributes.size = variant.attributes.size.name;
        }
        if (features.includes('material') && variant.attributes.material) {
          variantData.attributes.material = variant.attributes.material.name;
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

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit || 1000;

    // Đếm tổng số bản ghi
    const totalItems = await this.productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // Lấy danh sách sản phẩm
    const products = await this.productModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    // Gắn inventory vào từng product
    const resultssss = await this.addInforInventoryProduct(products)
    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result: resultssss,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid product ID: ${id}`);
    }

    // Tìm sản phẩm và populate màu
    const product = await (await this.productModel.findById(id)).populate("category");
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Lấy thông tin từ các service khác
    const productInventory =
      await this.inventoryProductService.findByProductId(id);
    const quantityComments = await this.reviewService.getQuantityComment(id);
    // Chuẩn bị dữ liệu trả về
    const newData = {
      product: { ...product.toObject() },
      quantityComments: +quantityComments,
      inventory: {
        productInventory
      }
      //quantity: productInventory?.quantity || 0,
    };

    return newData;
  }

  async findOneForUser(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found product with id=${id}`);
    }
    this.userService.updateRecentViewProduct(user, id as any);
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    // Lấy thông tin từ các service khác
    const productInventory =
      await this.inventoryProductService.findByProductId(id);
    const quantityComments = await this.reviewService.getQuantityComment(id);
    // Chuẩn bị dữ liệu trả về
    const newData = {
      product: { ...product.toObject() },
      // colors: product.colors, // Thay thế ID của màu bằng thông tin chi tiết (mã màu hoặc tên)
      quantityComments: +quantityComments,
      inventory: {
        productInventory
      }
      //quantity: productInventory?.quantity || 0,
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
    const {
      _id,
      brand,
      category,
      description,
      images,
      name,
      tags,
      features,
      variants,
      code,
    } = updateProductDto;

    // Kiểm tra tồn tại sản phẩm
    const existingProduct: any = await this.productModel.findById(_id);
    if (!existingProduct) {
      throw new NotFoundException('Sản phẩm không tồn tại.');
    }

    // Kiểm tra nếu code đã tồn tại ở sản phẩm khác
    if (code && code !== existingProduct.code) {
      const codeExisted = await this.productModel.findOne({ code });
      if (codeExisted) {
        throw new BadRequestException('Mã sản phẩm (code) đã tồn tại.');
      }
    }

    // Cập nhật thông tin sản phẩm
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      _id,
      {
        brand,
        category,
        description,
        images,
        name,
        tags,
        features,
        code,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      { new: true }
    );

    // Giữ lại các biến thể cũ và thêm các biến thể mới
    let existingVariants = existingProduct.variants || [];
    let newVariants = variants || [];

    // Lọc các biến thể mới để thêm vào (nếu có)
    newVariants = newVariants.filter((newVariant: any) => {
      // Nếu biến thể chưa tồn tại trong cũ thì mới thêm vào
      return !existingVariants.some(
        (existingVariant: any) =>
          JSON.stringify(existingVariant.attributes) ===
          JSON.stringify(newVariant.attributes)
      );
    });

    // Gộp biến thể cũ và mới lại
    const updatedVariants = [...existingVariants, ...newVariants];

    // Cập nhật lại biến thể cho sản phẩm
    updatedProduct.variants = updatedVariants;

    // Chuẩn bị dữ liệu biến thể cho kho
    let dataVariants: any[] = [];
    if (updatedVariants.length) {
      dataVariants = updatedVariants.map((variant: any) => {
        const variantData: any = {
          attributes: {} as any,
        };

        if (features.includes('color') && variant.attributes.color) {
          variantData.attributes.color = variant.attributes.color.name;
        }
        if (features.includes('size') && variant.attributes.size) {
          variantData.attributes.size = variant.attributes.size.name;
        }
        if (features.includes('material') && variant.attributes.material) {
          variantData.attributes.material = variant.attributes.material.name;
        }

        // Nếu đã có thông tin giá/kho => giữ lại, nếu không gán mặc định
        variantData.importPrice = variant.importPrice ?? 0;
        variantData.exportPrice = variant.exportPrice ?? 0;
        variantData.stock = variant.stock ?? 0;
        variantData.sellPrice = variant.sellPrice ?? 0;

        return variantData;
      });
    }

    // Chuẩn bị DTO cập nhật kho
    const inventoryUpdateDto: CreateInventoryProductDto = {
      productId: _id,
      productVariants: dataVariants,
    };

    // Cập nhật kho
    await this.inventoryProductService.update(inventoryUpdateDto, user);
    await updatedProduct.save();
    return updatedProduct;
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

    // Lấy danh sách productId từ recentViewProducts
    const recentViews = userDB.recentViewProducts;
    const recentProductIds = recentViews.map((item) => item.productId);

    // Truy vấn danh sách sản phẩm
    const products = await this.productModel
      .find({ _id: { $in: recentProductIds } })
      .select(['_id', 'name', 'images', 'brand', 'rating', 'category'])
      .populate('category')
      .exec();

    // Gắn thông tin tồn kho
    const productsWithInventory = await this.addInforInventoryProduct(products);

    // Tạo Map productId => timeView
    const timeViewMap = new Map(
      recentViews.map((item) => [item.productId.toString(), item.timeView])
    );

    // Bổ sung timeView vào kết quả
    const result = productsWithInventory.map((product) => ({
      ...product,
      timeView: timeViewMap.get(product._id.toString()) || null,
    }));

    return result;
  }


  async getProductsPurchasedByUser(user: IUser) {
    const userDB = (await this.userService.findOne(user._id)) as any;
    const products = await this.productModel
      .find({ _id: { $in: userDB.purchasedProducts.map(id => new Types.ObjectId(id)) } })
      .select(['_id', 'name', 'images', 'brand', 'rating', 'category'])
      .populate('category')
      .exec();
    const result = await this.addInforInventoryProduct(products)
    return result
  }


  async addInforInventoryProduct(products: any) {

    // Lấy danh sách _id sản phẩm để truy vấn tồn kho
    const productIds = products.map((product) => product._id);

    // Lấy thông tin tồn kho tương ứng
    const inventoryList = await this.inventoryProductModel
      .find({ productId: { $in: productIds } })
      // .select([])
      .exec();

    // Map productId => inventory để tra nhanh
    const inventoryMap = new Map(
      inventoryList.map((inv) => [inv.productId.toString(), inv])
    );

    // Gắn inventory vào từng product
    const result = products.map((product) => {

      const inventory = inventoryMap.get(product._id.toString());
      return {
        ...product.toObject(),
        inventory: inventory || null, // có thể null nếu chưa có tồn kho
      };
    });
    return result
  }
}

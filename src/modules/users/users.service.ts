import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { ProfileUserDto, UpdateProfileUser, UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';
import { MailerService } from '@nestjs-modules/mailer';

import dayjs from 'dayjs';
import { ChangePasswordAuthDto, CodeAuthDto } from 'src/auth/dto/create-auth.dto';
import * as crypto from 'crypto';
import { ReceiptsService } from '../receipts/receipts.service';
import { RECEIPT_STATUS } from 'src/constants/schema.enum';
// import { Role, RoleDocument } from '../roles/schemas/role.schemas';
// import { USER_ROLE } from 'src/databases/sample';
@Injectable()
export class UsersService {

  constructor(
    @InjectModel(UserM.name)
    private userModel: SoftDeleteModel<UserDocument>,
    // @InjectModel(Role.name)
    // private roleModel: SoftDeleteModel<RoleDocument>,

    private readonly mailerService: MailerService,

  ) { }


  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    const {
      name, email, password,
      gender,
      //address,age,
    }
      = createUserDto;

    //add logic check email
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`)
    }
    //fetch user role
    // const userRole = await this.roleModel.findOne({ name: USER_ROLE });

    const hashPassword = this.getHashPassword(password);

    let newUser = await this.userModel.create({
      name, email,
      password: hashPassword,
      // age,
      // gender, address,
      // role: userRole?._id,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return newUser;
  }

  async register(user: RegisterUserDto) {
    // const { name, email, password, age, gender, address } = user;
    const { name, email, password } = user;
    //add logic check email
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`)
    }
    //fetch user role
    // const userRole = await this.roleModel.findOne({ name: USER_ROLE });

    const hashPassword = this.getHashPassword(password);
    const codeId = crypto.randomInt(100000, 999999);
    let newRegister = await this.userModel.create({
      name, email,
      password: hashPassword,
      // age,
      // gender,
      // address,
      // role: userRole?._id,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })
    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Activate your account at @ABCxyz', // Subject line
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    return newRegister;
  }

  async findAll(currentPage: number, limit: number, qs: string) {

    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;


    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 1000;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
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
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`;

    return await this.userModel.findOne({
      _id: id
    })
      .select("-password")
      .populate({ path: "role", select: { name: 1, _id: 1 } })

  }
  async findOneCoupon(id: string) {

    // Tìm người dùng và lọc danh sách couponsUser có isActive: false
    const user = await this.userModel
      .findOne({ _id: id, isActive: true })
      .select(["couponsUser", "name", "email"]);


    if (!user) {
      throw new NotFoundException('User not found or inactive');
    }

    // Lọc danh sách couponsUser
    const inactiveCoupons = user.couponsUser.filter(coupon => coupon.isActive === false);

    return {
      ...user.toObject(),
      couponsUser: inactiveCoupons
    };
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    }).populate({
      path: "role",
      select: { name: 1 }
    });

  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {

    const updated = await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      });
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`;

    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return this.userModel.softDelete({
      _id: id
    })
  }

  updateUserToken = async (refreshToken: string, _id: string, isActive = true) => {
    return await this.userModel.updateOne(
      { _id },
      { refreshToken },
      { isActive }
    )
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken }).populate({
      path: "role",
      select: { name: 1 }
    });

  }
  async handleActive(data: CodeAuthDto) {

    const user = await this.userModel.findOne({
      email: data.email,
      codeId: data.code
    })
    if (!user) {
      throw new BadRequestException("Mã OTP không hợp lệ hoặc đã hết hạn")
    }

    //check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      //valid => update user
      await this.userModel.updateOne({
        email: data.email,
        codeId: data.code
      }, {
        isActive: true
      })
      return { isBeforeCheck };
    } else {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }


  }
  async retryActive(email: string) {
    //check email
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }
    if (user.isActive) {
      throw new BadRequestException("Tài khoản đã được kích hoạt")
    }

    //send Email
    const codeId = crypto.randomInt(100000, 999999);

    //update user
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })

    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Activate your account at @ABCxyz', // Subject line
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    return { _id: user._id }
  }
  async retryPassword(email: string) {
    //check email
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }


    //send Email
    const codeId = crypto.randomInt(100000, 999999);

    //update user
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })

    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Change your password account at @ABCxyz', // Subject line
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    return { _id: user._id, email: user.email }
  }
  async changePassword(data: ChangePasswordAuthDto) {
    if (data.confirmPassword !== data.password) {
      throw new BadRequestException("Mật khẩu/xác nhận mật khẩu không chính xác.")
    }
    //check email
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }
    //check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if (isBeforeCheck) {
      // check oldpassword

      //valid => update password
      const newPassword = this.getHashPassword(data.password);
      await user.updateOne({ password: newPassword })
      return { isBeforeCheck };
    } else {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }
  }
  async updateProfile(userDto: ProfileUserDto, user: IUser) {
    let updateUser = await this.userModel.updateOne(
      { _id: user._id },
      {
        ...userDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return updateUser;
  }
  async updatePurchasedProducts(userId: string, productIds: string[], point: number) {
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { purchasedProducts: { $each: productIds } },
      $inc: { point: point }
    }, {
      new: true,
    });
  }
  async updateRecentViewProduct(user: IUser, productId: string) {
    await this.userModel.findByIdAndUpdate(user._id, {
      $addToSet: { recentViewProducts: productId },
    }, {
      new: true,
    });
  }

  async checkPurchasedProduct(userId: string, productId: string) {
    const re = await this.userModel.findById(userId);
    return re.purchasedProducts.includes(productId as any);
  }
  async updateSocketId(userId: string, socketId: string = null) {
    // if (userId) {
    //   throw new BadRequestException(`Không có user id`)
    // }
    return await this.userModel.findByIdAndUpdate(
      { _id: userId },
      {
        $set: { socketId: socketId }
      },
    );


  }
  async getAllUserAcceptPoint(point: number = 0, couponId: string) {
    if (!mongoose.Types.ObjectId.isValid(couponId))
      throw new NotFoundException(`Not found coupon`);

    return await this.userModel.find({
      isActive: true,
      point: { $gte: point },  // Điều kiện user.point >=point
      'couponsUser._id': { $nin: [couponId] }  // couponsUser không chứa coupon có _id là code
    })
      .select({ point: 1, _id: 1, couponsUser: 1 })
      .exec();
  }
  async updateUserNewCoupons(userId: string, coupon: {
    _id: string, name: string, code: string, couponExpired: Date
  }) {
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new NotFoundException(`Not found coupon`);
    const { _id, name, code, couponExpired } = coupon
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: {
        couponsUser: {
          _id, name, code, couponExpired,
          isActive: false,
        }
      },
    }, {
      new: true,
    });
  }

  async checkConnectSocketIo(userId: string) {
    const user = await this.findOne(userId) as any;
    return user.socketId;
  }
  async checkIsActiveCode(userId: string, couponId: string, active: boolean = true) {
    const user = await this.userModel.findOne({
      _id: userId
    });

    const coupon = user.couponsUser.find(coupon => {
      // so sánh string vs mongo id
      return (new mongoose.Types.ObjectId(coupon._id.toString())).equals(couponId) && coupon.isActive === !active
    })

    if (!coupon && active === true) {
      throw new NotFoundException(`Coupon with ID ${couponId} for this user is actived`);
    }
    if (coupon) {
      coupon.isActive = active;
      await user.save();
    }
    else {
      throw new NotFoundException(`Coupon with ID ${couponId} for this user is actived`);
    }

  }
  async updateUserProfile(user: IUser, data: UpdateProfileUser) {
    const updated = await this.userModel.updateOne(
      { _id: user._id },
      {
        ...data,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      });
    return updated;
  }
  async updateUserRole(id: string, role: any) {
    const user = await this.userModel.findById(id);
    user.role = role.role;
    await user.save();
    return user;
  }
  async blockUser(id: string) {
    const user = await this.userModel.findById(id);
    user.isBlocked = !user.isBlocked;
    await user.save();
    return user;
  }

}

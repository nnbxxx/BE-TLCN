import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileUserDtoSw, UpdateProfileUser, UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Cron, CronExpression } from '@nestjs/schedule';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ResponseMessage("Create a new User")
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    let newUser = await this.usersService.create(createUserDto, user);
    return {
      _id: newUser?._id,
      // createdAt: newUser?.createdAt
    };
  }

  @Get()
  @ResponseMessage("Fetch user with paginate")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("Fetch user by id")
  async findOne(@Param('id') id: string) {
    const foundUser = await this.usersService.findOne(id);
    return foundUser;
  }

  @Get('/coupon/:id')
  @ResponseMessage("Fetch user by id")
  async findOneCoupon(@Param('id') id: string) {
    const foundUser = await this.usersService.findOneCoupon(id);
    return foundUser;
  }

  @ResponseMessage("Update a User")
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    let updatedUser = await this.usersService.update(updateUserDto, user);
    return updatedUser;
  }
  @ResponseMessage("Update a User")
  @Patch('/profile')
  async updateProfileUser(@Body() updateUserDto: UpdateProfileUser, @User() user: IUser) {
    let updatedUser = await this.usersService.updateUserProfile(user, updateUserDto);
    return updatedUser;
  }

  @Delete(':id')
  @ResponseMessage("Delete a User")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }




}

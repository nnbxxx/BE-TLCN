import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/users/schemas/user.schema';
import { Permission, PermissionSchema } from 'src/modules/permissions/schemas/permission.schemas';
import { Role, RoleSchema } from 'src/modules/roles/schemas/role.schemas';
import { UsersModule } from 'src/modules/users/users.module';
import { RolesModule } from 'src/modules/roles/roles.module';
import { PermissionsModule } from 'src/modules/permissions/permissions.module';

@Module({
  controllers: [DatabasesController],
  providers: [DatabasesService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    UsersModule,
    RolesModule,
    PermissionsModule
  ],

})
export class DatabasesModule { }

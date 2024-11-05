import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from 'src/modules/permissions/schemas/permission.schemas';
import { Role, RoleDocument } from 'src/modules/roles/schemas/role.schemas';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class DatabasesService implements OnModuleInit {
    private readonly logger = new Logger(DatabasesService.name);
    constructor(
        @InjectModel(User.name)
        private userModel: SoftDeleteModel<UserDocument>,

        @InjectModel(Permission.name)
        private permissionModel: SoftDeleteModel<PermissionDocument>,

        @InjectModel(Role.name)
        private roleModel: SoftDeleteModel<RoleDocument>,

        private configService: ConfigService,
        private userService: UsersService
    ) { }

    onModuleInit() {
        console.log(`The module has been initialized.`);
    }

}

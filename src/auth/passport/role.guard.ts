import {
    Injectable,
    CanActivate,
    ExecutionContext,
    SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export enum USER_BASE_ROLES {
    ADMIN = 'admin',
    USER = 'user',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: USER_BASE_ROLES[]) =>
    SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<
            USER_BASE_ROLES[]
        >(ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles) {
            return true; // No specific roles required, allow access
        }

        const request = context.switchToHttp().getRequest<Request>();
        const user = request['user']; // Assuming the user object with roles is attached

        if (!user || !user.role) {
            return false; // No user or roles found
        }

        return requiredRoles.some((role) => {
            if (typeof user.role === 'string') {
                return user.role.toLowerCase().includes(role);
            }
            if (user.role.name) {
                return user.role.name.toLowerCase().includes(role);
            }

            return false;
        });
    }
}

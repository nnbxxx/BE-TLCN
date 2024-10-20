import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
// tạo decorator Public để truyền thêm Metadate vào function
// Metadate sẽ được lấy theo (key: value)

// export const RESPONSE_MESSAGE_KEY = 'response_message';
// export const ResponseMessage = (message: string) =>
//   SetMetadata(RESPONSE_MESSAGE_KEY, message);
// truyền vào 1 message:string, rồi gán vào metadate

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
    // ý nghĩa:
    // import {Request} from Express;
    // @Req req: Request;
    // coust user = req.user; ==> cách cũ này không tường minh và mất 2 lần code

  },
);

// export const IS_PUBLIC_PERMISSION = 'isPublicPerminssion';
// export const SkipCheckPermission = () =>
//   SetMetadata(IS_PUBLIC_PERMISSION, true);
// tạo decorator Public để truyền thêm Metadate vào function
// Metadate sẽ được lấy theo (key, value)
export const RESPONSE_MESSAGE = 'response_message';
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);

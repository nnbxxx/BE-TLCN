export const ADMIN_ROLE = 'SUPER_ADMIN'
export const USER_ROLE = 'NORMAL_USER'
export const INIT_PERMISSIONS = [
    {
        "_id": "6729e9438c996e56434323b5",
        "name": "Tạo mới một user ",
        "apiPath": "/api/v1/users",
        "method": "POST",
        "module": "USERS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T09:45:39.540Z",
        "updatedAt": "2024-11-05T09:45:39.540Z",
        "__v": 0
    },
    {
        "_id": "6729e9ab8c996e56434323c3",
        "name": "Lấy danh sách user",
        "apiPath": "/api/v1/users",
        "method": "GET",
        "module": "USERS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T09:47:23.296Z",
        "updatedAt": "2024-11-05T09:47:23.296Z",
        "__v": 0
    },
    {
        "_id": "6729e9c98c996e56434323c5",
        "name": "Lấy thông tin chi tiết user",
        "apiPath": "/api/v1/users/:id",
        "method": "GET",
        "module": "USERS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T09:47:53.412Z",
        "updatedAt": "2024-11-05T09:47:53.412Z",
        "__v": 0
    },
    {
        "_id": "6729e9e98c996e56434323cd",
        "name": "Lấy thông tin danh sách coupon của user(client)",
        "apiPath": "/api/v1/users/coupon/:id",
        "method": "GET",
        "module": "USERS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T09:48:25.497Z",
        "updatedAt": "2024-11-05T09:48:25.497Z",
        "__v": 0
    },
    {
        "_id": "6729ea5f8c996e56434323db",
        "name": "Cập nhật thông tin của user",
        "apiPath": "/api/v1/users",
        "method": "PATCH",
        "module": "USERS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T09:50:23.051Z",
        "updatedAt": "2024-11-05T09:50:23.051Z",
        "__v": 0
    },
    {
        "_id": "6729ea768c996e56434323dd",
        "name": "Cập nhật thông tin của user(client)",
        "apiPath": "/api/v1/users/profile",
        "method": "PATCH",
        "module": "USERS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T09:50:46.574Z",
        "updatedAt": "2024-11-05T09:50:46.574Z",
        "__v": 0
    },
    {
        "_id": "6729eaaf8c996e56434323e5",
        "name": "Xóa tài khoản của user",
        "apiPath": "/api/v1/users/:id",
        "method": "DELETE",
        "module": "USERS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T09:51:43.903Z",
        "updatedAt": "2024-11-05T09:51:43.903Z",
        "__v": 0
    },
    {
        "_id": "6729eaed8c996e56434323ed",
        "name": "Đăng nhập tài khoản",
        "apiPath": "/api/v1/auth/login",
        "method": "POST",
        "module": "AUTH",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T09:52:45.824Z",
        "updatedAt": "2024-11-05T09:52:45.824Z",
        "__v": 0
    },
    {
        "_id": "6729eb018c996e56434323f5",
        "name": "Đăng ký tài khoản",
        "apiPath": "/api/v1/auth/register",
        "method": "POST",
        "module": "AUTH",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T09:53:05.050Z",
        "updatedAt": "2024-11-05T09:53:05.050Z",
        "__v": 0
    },
    {
        "_id": "6729eb528c996e56434323fd",
        "name": "Kiểm tra OTP xác thực tài khoản tài khoản",
        "apiPath": "/api/v1/auth/check-code",
        "method": "POST",
        "module": "AUTH",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T09:54:26.418Z",
        "updatedAt": "2024-11-05T09:54:26.418Z",
        "__v": 0
    },
    {
        "_id": "6729ebb88c996e564343240b",
        "name": "Lấy thông tin tài khoản",
        "apiPath": "/api/v1/auth/account",
        "method": "GET",
        "module": "AUTH",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T09:56:08.985Z",
        "updatedAt": "2024-11-05T09:56:08.985Z",
        "__v": 0
    },
    {
        "_id": "6729ebec8c996e5643432413",
        "name": "Lấy lại accesstoken của tài khoản",
        "apiPath": "/api/v1/auth/refresh",
        "method": "GET",
        "module": "AUTH",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T09:57:00.633Z",
        "updatedAt": "2024-11-05T09:57:00.633Z",
        "__v": 0
    },
    {
        "_id": "6729ec648c996e5643432421",
        "name": "Đăng xuất tài khoản",
        "apiPath": "/api/v1/auth/logout",
        "method": "POST",
        "module": "AUTH",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T09:59:00.544Z",
        "updatedAt": "2024-11-05T09:59:00.544Z",
        "__v": 0
    },
    {
        "_id": "6729ecd78c996e5643432429",
        "name": "Gửi lại OTP xác thực tài khoản tài khoản",
        "apiPath": "/api/v1/auth/retry-active",
        "method": "POST",
        "module": "AUTH",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:00:55.725Z",
        "updatedAt": "2024-11-05T10:00:55.725Z",
        "__v": 0
    },
    {
        "_id": "6729ecf08c996e5643432431",
        "name": "Gửi lại OTP xác thực tài khoản quên mật khẩu",
        "apiPath": "/api/v1/auth/retry-password",
        "method": "POST",
        "module": "AUTH",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:01:20.885Z",
        "updatedAt": "2024-11-05T10:01:20.885Z",
        "__v": 0
    },
    {
        "_id": "6729ed3d8c996e564343243a",
        "name": "Cập nhật lại mật khẩu tài khoản quên mật khẩu",
        "apiPath": "/api/v1/auth/change-password",
        "method": "PATCH",
        "module": "AUTH",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:02:37.578Z",
        "updatedAt": "2024-11-05T10:02:37.578Z",
        "__v": 0
    },
    {
        "_id": "6729ed658c996e5643432442",
        "name": "Cập nhật thông tin tài khoản(user)",
        "apiPath": "/api/v1/auth/update-profile",
        "method": "PATCH",
        "module": "AUTH",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:03:17.642Z",
        "updatedAt": "2024-11-05T10:03:17.642Z",
        "__v": 0
    },
    {
        "_id": "6729edb18c996e564343244a",
        "name": "Tạo mới giỏ hàng (user)",
        "apiPath": "/api/v1/carts/create",
        "method": "POST",
        "module": "CARTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:04:33.737Z",
        "updatedAt": "2024-11-05T10:04:33.737Z",
        "__v": 0
    },
    {
        "_id": "6729edda8c996e5643432452",
        "name": "Thêm sản phẩm vào giỏ hàng (user)",
        "apiPath": "/api/v1/carts/add",
        "method": "POST",
        "module": "CARTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:05:14.601Z",
        "updatedAt": "2024-11-05T10:05:14.601Z",
        "__v": 0
    },
    {
        "_id": "6729edf78c996e5643432454",
        "name": "Cật nhật sản phẩm của giỏ hàng (user)",
        "apiPath": "/api/v1/carts/update",
        "method": "POST",
        "module": "CARTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:05:43.301Z",
        "updatedAt": "2024-11-05T10:05:43.301Z",
        "__v": 0
    },
    {
        "_id": "6729ee79d7bf3ad89e41915b",
        "name": "Xóa tất cả sản phẩm của giỏ hàng (user)",
        "apiPath": "/api/v1/carts/remove-all",
        "method": "POST",
        "module": "CARTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:07:53.444Z",
        "updatedAt": "2024-11-05T10:07:53.444Z",
        "__v": 0
    },
    {
        "_id": "6729eecbd7bf3ad89e419169",
        "name": "Lấy thông tin tất cả sản phẩm của giỏ hàng (user)",
        "apiPath": "/api/v1/carts/user",
        "method": "GET",
        "module": "CARTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:09:15.487Z",
        "updatedAt": "2024-11-05T10:09:15.487Z",
        "__v": 0
    },
    {
        "_id": "6729ef33d7bf3ad89e419171",
        "name": "Xóa 1 sản phẩm của giỏ hàng (user)",
        "apiPath": "/api/v1/carts/:id",
        "method": "DELETE",
        "module": "CARTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:10:59.678Z",
        "updatedAt": "2024-11-05T10:10:59.678Z",
        "__v": 0
    },
    {
        "_id": "6729ef8dd7bf3ad89e419181",
        "name": "Lấy danh sách các sản phẩm",
        "apiPath": "/api/v1/products",
        "method": "GET",
        "module": "PRODUCTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:12:29.211Z",
        "updatedAt": "2024-11-05T10:12:29.211Z",
        "__v": 0
    },
    {
        "_id": "6729efa7d7bf3ad89e419183",
        "name": "Lấy thông tin chi tiết sản phẩm",
        "apiPath": "/api/v1/products/:id",
        "method": "GET",
        "module": "PRODUCTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:12:55.812Z",
        "updatedAt": "2024-11-05T10:12:55.812Z",
        "__v": 0
    },
    {
        "_id": "6729efc1d7bf3ad89e41918b",
        "name": "Lấy thông tin chi tiết sản phẩm khi user đã login",
        "apiPath": "/api/v1/products/user/:id",
        "method": "GET",
        "module": "PRODUCTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:13:21.936Z",
        "updatedAt": "2024-11-05T10:13:21.936Z",
        "__v": 0
    },
    {
        "_id": "6729efecd7bf3ad89e419193",
        "name": "Cập nhật thông tin sản phẩm",
        "apiPath": "/api/v1/products",
        "method": "PATCH",
        "module": "PRODUCTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:14:04.769Z",
        "updatedAt": "2024-11-05T10:14:04.769Z",
        "__v": 0
    },
    {
        "_id": "6729f000d7bf3ad89e419195",
        "name": "Xóa sản phẩm",
        "apiPath": "/api/v1/products/:id",
        "method": "DELETE",
        "module": "PRODUCTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:14:24.238Z",
        "updatedAt": "2024-11-05T10:14:24.238Z",
        "__v": 0
    },
    {
        "_id": "6729f041d7bf3ad89e41919d",
        "name": "Xóa sản phẩm",
        "apiPath": "/api/v1/products/:id",
        "method": "DELETE",
        "module": "PRODUCTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:15:29.185Z",
        "updatedAt": "2024-11-05T10:15:29.185Z",
        "__v": 0
    },
    {
        "_id": "6729f0a2c10e8464f2a2e203",
        "name": "Thêm kho sản phẩm",
        "apiPath": "/api/v1/inventory-product",
        "method": "POST",
        "module": "INVENTORY-PRODUCT",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:17:06.467Z",
        "updatedAt": "2024-11-05T10:17:06.467Z",
        "__v": 0
    },
    {
        "_id": "6729f0bac10e8464f2a2e205",
        "name": "Lấy danh sách kho sản phẩm",
        "apiPath": "/api/v1/inventory-product",
        "method": "GET",
        "module": "INVENTORY-PRODUCT",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:17:30.688Z",
        "updatedAt": "2024-11-05T10:17:30.688Z",
        "__v": 0
    },
    {
        "_id": "6729f0d0c10e8464f2a2e207",
        "name": "Lấy thông tin chi tiết kho sản phẩm",
        "apiPath": "/api/v1/inventory-product",
        "method": "GET",
        "module": "INVENTORY-PRODUCT",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:17:52.821Z",
        "updatedAt": "2024-11-05T10:17:52.821Z",
        "__v": 0
    },
    {
        "_id": "6729f108c10e8464f2a2e20f",
        "name": "Tạo mới bài đánh giá",
        "apiPath": "/api/v1/reviews",
        "method": "POST",
        "module": "REVIEWS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:18:48.515Z",
        "updatedAt": "2024-11-05T10:18:48.515Z",
        "__v": 0
    },
    {
        "_id": "6729f118c10e8464f2a2e217",
        "name": "Lấy danh sách bài đánh giá",
        "apiPath": "/api/v1/reviews",
        "method": "GET",
        "module": "REVIEWS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:19:04.552Z",
        "updatedAt": "2024-11-05T10:19:04.552Z",
        "__v": 0
    },
    {
        "_id": "6729f1b1e449fd6905a5249e",
        "name": "Tạo danh sách sản phẩm yêu thích (client)",
        "apiPath": "/api/v1/like-products/create",
        "method": "POST",
        "module": "LIKE-PRODUCTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:21:37.959Z",
        "updatedAt": "2024-11-05T10:21:37.959Z",
        "__v": 0
    },
    {
        "_id": "6729f1e4e449fd6905a524a6",
        "name": "Thêm sản phẩm vào danh sách yêu thích (client)",
        "apiPath": "/api/v1/like-products/add",
        "method": "POST",
        "module": "LIKE-PRODUCTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:22:28.050Z",
        "updatedAt": "2024-11-05T10:22:28.050Z",
        "__v": 0
    },
    {
        "_id": "6729f207e449fd6905a524ae",
        "name": "Thêm sản phẩm vào danh sách yêu thích (client)",
        "apiPath": "/api/v1/like-products/add",
        "method": "POST",
        "module": "LIKE-PRODUCTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:23:03.120Z",
        "updatedAt": "2024-11-05T10:23:03.120Z",
        "__v": 0
    },
    {
        "_id": "6729f228e449fd6905a524b0",
        "name": "Xóa tất cả sản phẩm của danh sách yêu thích (client)",
        "apiPath": "/api/v1/like-products/remove-all",
        "method": "POST",
        "module": "LIKE-PRODUCTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:23:36.549Z",
        "updatedAt": "2024-11-05T10:23:36.549Z",
        "__v": 0
    },
    {
        "_id": "6729f27ce449fd6905a524be",
        "name": "Xóa sản phẩm khỏi danh sách yêu thích (client)",
        "apiPath": "/api/v1/like-products/:id",
        "method": "DELETE",
        "module": "LIKE-PRODUCTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:25:00.172Z",
        "updatedAt": "2024-11-05T10:25:00.172Z",
        "__v": 0
    },
    {
        "_id": "6729f29ee449fd6905a524c0",
        "name": "Lấy danh sách yêu thích của user(client)",
        "apiPath": "/api/v1/like-products/user",
        "method": "GET",
        "module": "LIKE-PRODUCTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:25:34.181Z",
        "updatedAt": "2024-11-05T10:25:34.181Z",
        "__v": 0
    },
    {
        "_id": "6729f2d5e449fd6905a524c8",
        "name": "Lấy thông tin chi tiết sản phẩm phẩm yêu thích của user(client)",
        "apiPath": "/api/v1/like-products/user/:id",
        "method": "GET",
        "module": "LIKE-PRODUCTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:26:29.461Z",
        "updatedAt": "2024-11-05T10:26:29.461Z",
        "__v": 0
    },
    {
        "_id": "6729f372e449fd6905a524dc",
        "name": "TEST GỬI EMAIL",
        "apiPath": "/api/v1/mail",
        "method": "GET",
        "module": "MAIL",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:29:06.857Z",
        "updatedAt": "2024-11-05T10:29:06.857Z",
        "__v": 0
    },
    {
        "_id": "6729f3cde449fd6905a524e4",
        "name": "Tạo mới danh mục sản phẩm",
        "apiPath": "/api/v1/categories",
        "method": "POST",
        "module": "CATEGORIES",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:30:37.005Z",
        "updatedAt": "2024-11-05T10:30:37.005Z",
        "__v": 0
    },
    {
        "_id": "6729f3fde449fd6905a524ec",
        "name": "Danh sách danh mục sản phẩm",
        "apiPath": "/api/v1/categories",
        "method": "GET",
        "module": "CATEGORIES",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:31:25.852Z",
        "updatedAt": "2024-11-05T10:31:25.852Z",
        "__v": 0
    },
    {
        "_id": "6729f4cbfc80ca6e541d709b",
        "name": "Danh sách các tỉnh/ thành phố",
        "apiPath": "/api/v1/address/province",
        "method": "GET",
        "module": "ADDRESS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:34:51.331Z",
        "updatedAt": "2024-11-05T10:34:51.331Z",
        "__v": 0
    },
    {
        "_id": "6729f51cfc80ca6e541d730b",
        "name": "Danh sách các quận/huyện",
        "apiPath": "/api/v1/address/district",
        "method": "GET",
        "module": "ADDRESS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:36:12.191Z",
        "updatedAt": "2024-11-05T10:36:12.191Z",
        "__v": 0
    },
    {
        "_id": "6729f53dfc80ca6e541d756f",
        "name": "Danh sách các phường/xã",
        "apiPath": "/api/v1/address/district",
        "method": "GET",
        "module": "ADDRESS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:36:45.260Z",
        "updatedAt": "2024-11-05T10:36:45.260Z",
        "__v": 0
    },
    {
        "_id": "6729f59cfc80ca6e541d757d",
        "name": "Tạo hóa đơn (client)",
        "apiPath": "/api/v1/receipts",
        "method": "POST",
        "module": "RECEIPTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:38:20.685Z",
        "updatedAt": "2024-11-05T10:38:20.685Z",
        "__v": 0
    },
    {
        "_id": "6729f5cefc80ca6e541d7585",
        "name": "Áp dụng mã giảm giá cho hóa đơn (client)",
        "apiPath": "/api/v1/receipts/coupon/active/:id",
        "method": "POST",
        "module": "RECEIPTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:39:10.223Z",
        "updatedAt": "2024-11-05T10:39:10.223Z",
        "__v": 0
    },
    {
        "_id": "6729f5e4fc80ca6e541d7587",
        "name": "Hủy áp dụng mã giảm giá cho hóa đơn (client)",
        "apiPath": "/api/v1/receipts/coupon/unactive/:id",
        "method": "POST",
        "module": "RECEIPTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:39:32.116Z",
        "updatedAt": "2024-11-05T10:39:32.116Z",
        "__v": 0
    },
    {
        "_id": "6729f60efc80ca6e541d758f",
        "name": "Xác nhận hóa đơn (client)",
        "apiPath": "/api/v1/receipts/confirmPayment",
        "method": "POST",
        "module": "RECEIPTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:40:14.072Z",
        "updatedAt": "2024-11-05T10:40:14.072Z",
        "__v": 0
    },
    {
        "_id": "6729f62bfc80ca6e541d7591",
        "name": "Xác nhận hủy hóa đơn (client)",
        "apiPath": "/api/v1/receipts/user/return",
        "method": "POST",
        "module": "RECEIPTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:40:43.272Z",
        "updatedAt": "2024-11-05T10:40:43.272Z",
        "__v": 0
    },
    {
        "_id": "6729f655fc80ca6e541d7599",
        "name": "Lấy danh sách hóa đơn",
        "apiPath": "/api/v1/receipts",
        "method": "GET",
        "module": "RECEIPTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:41:25.136Z",
        "updatedAt": "2024-11-05T10:41:25.136Z",
        "__v": 0
    },
    {
        "_id": "6729f66dfc80ca6e541d759b",
        "name": "Lấy thông tin chi tiết hóa đơn",
        "apiPath": "/api/v1/receipts/:id",
        "method": "GET",
        "module": "RECEIPTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:41:49.240Z",
        "updatedAt": "2024-11-05T10:41:49.240Z",
        "__v": 0
    },
    {
        "_id": "6729f69bfc80ca6e541d75a4",
        "name": "Tự động xác nhận các hóa đơn sau 30p",
        "apiPath": "/api/v1/receipts/auto/auto_active",
        "method": "GET",
        "module": "RECEIPTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:42:35.436Z",
        "updatedAt": "2024-11-05T10:42:35.436Z",
        "__v": 0
    },
    {
        "_id": "6729f6f4fc80ca6e541d75b0",
        "name": "Thống kê dòng tiền của tất cả hóa đơn",
        "apiPath": "/api/v1/receipts/user/cash-flow",
        "method": "GET",
        "module": "RECEIPTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:44:04.413Z",
        "updatedAt": "2024-11-05T10:44:04.413Z",
        "__v": 0
    },
    {
        "_id": "6729f747fc80ca6e541d75b8",
        "name": "Tạo URL thanh toán hóa đơn VNPAY",
        "apiPath": "/api/v1/receipts/create/payment-url",
        "method": "GET",
        "module": "RECEIPTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:45:27.281Z",
        "updatedAt": "2024-11-05T10:45:27.281Z",
        "__v": 0
    },
    {
        "_id": "6729f7aefc80ca6e541d75c6",
        "name": "Tạo URL hoàn tiền hóa đơn VNPAY",
        "apiPath": "/api/v1/receipts/vnpay/callback",
        "method": "GET",
        "module": "RECEIPTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:47:10.978Z",
        "updatedAt": "2024-11-05T10:47:10.978Z",
        "__v": 0
    },
    {
        "_id": "6729f7f5fc80ca6e541d75ce",
        "name": "Cập nhật chi tiết hóa đơn",
        "apiPath": "/api/v1/receipts",
        "method": "PATCH",
        "module": "RECEIPTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:48:21.400Z",
        "updatedAt": "2024-11-05T10:48:21.400Z",
        "__v": 0
    },
    {
        "_id": "6729f824fc80ca6e541d75d6",
        "name": "Xóa sản phẩm chi tiết hóa đơn",
        "apiPath": "/api/v1/receipts/:id",
        "method": "DELETE",
        "module": "RECEIPTS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:49:08.264Z",
        "updatedAt": "2024-11-05T10:49:08.264Z",
        "__v": 0
    },
    {
        "_id": "6729f887fc80ca6e541d75de",
        "name": "Tạo mới mã khuyến mãi",
        "apiPath": "/api/v1/coupons",
        "method": "POST",
        "module": "COUPONS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T10:50:47.968Z",
        "updatedAt": "2024-11-05T10:50:47.968Z",
        "__v": 0
    },
    {
        "_id": "6729fce3ec1c3eac1627a57f",
        "name": "Lấy dánh sách mã khuyến mãi",
        "apiPath": "/api/v1/coupons",
        "method": "GET",
        "module": "COUPONS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T11:09:23.294Z",
        "updatedAt": "2024-11-05T11:09:23.294Z",
        "__v": 0
    },
    {
        "_id": "6729fd17ec1c3eac1627a587",
        "name": "Lấy chi tiết mã khuyến mãi",
        "apiPath": "/api/v1/coupons/:id",
        "method": "GET",
        "module": "COUPONS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T11:10:15.886Z",
        "updatedAt": "2024-11-05T11:10:15.886Z",
        "__v": 0
    },
    {
        "_id": "6729fd50ec1c3eac1627a594",
        "name": "Tự động thông báo mã khuyến mãi đến user khi đạt điều kiện",
        "apiPath": "/api/v1/coupons/user/auto_notification_coupons",
        "method": "GET",
        "module": "COUPONS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T11:11:12.095Z",
        "updatedAt": "2024-11-05T11:11:12.095Z",
        "__v": 0
    },
    {
        "_id": "6729fd8eec1c3eac1627a59c",
        "name": "Tạo mới một thông báo",
        "apiPath": "/api/v1/notifications",
        "method": "POST",
        "module": "NOTIFICATIONS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T11:12:14.534Z",
        "updatedAt": "2024-11-05T11:12:14.534Z",
        "__v": 0
    },
    {
        "_id": "6729fe301a8b41fceccf7485",
        "name": "Đánh dấu thông báo đã đọc",
        "apiPath": "/api/v1/notifications/mark-as-read/:id",
        "method": "PATCH",
        "module": "NOTIFICATIONS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T11:14:56.120Z",
        "updatedAt": "2024-11-05T11:14:56.120Z",
        "__v": 0
    },
    {
        "_id": "6729ff091a8b41fceccf749f",
        "name": "Lấy danh sách thông báo",
        "apiPath": "/api/v1/notifications/",
        "method": "GET",
        "module": "NOTIFICATIONS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T11:18:33.614Z",
        "updatedAt": "2024-11-05T11:18:33.614Z",
        "__v": 0
    },
    {
        "_id": "6729ff1f1a8b41fceccf74a1",
        "name": "Lấy danh sách thông báo của user",
        "apiPath": "/api/v1/notifications/user",
        "method": "GET",
        "module": "NOTIFICATIONS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-05T11:18:55.016Z",
        "updatedAt": "2024-11-05T11:18:55.016Z",
        "__v": 0
    },
    {
        "_id": "672ae48f2b8403083e2f5c7d",
        "name": "Upload 1 file trên cloud",
        "apiPath": "/api/v1/files/file",
        "method": "PATCH",
        "module": "FILES",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T03:37:51.228Z",
        "updatedAt": "2024-11-06T03:37:51.228Z",
        "__v": 0
    },
    {
        "_id": "672ae4a42b8403083e2f5c85",
        "name": "Upload nhiều file trên cloud",
        "apiPath": "/api/v1/files/files",
        "method": "PATCH",
        "module": "FILES",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T03:38:12.008Z",
        "updatedAt": "2024-11-06T03:38:12.008Z",
        "__v": 0
    },
    {
        "_id": "672ae51e2b8403083e2f5c95",
        "name": "Lấy danh sách địa chỉ user",
        "apiPath": "/api/v1/address-user",
        "method": "GET",
        "module": "ADDRESS-USER",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T03:40:14.551Z",
        "updatedAt": "2024-11-06T03:40:14.551Z",
        "__v": 0
    },
    {
        "_id": "672ae5382b8403083e2f5c97",
        "name": "Lấy chi tiết địa chỉ user",
        "apiPath": "/api/v1/address-user/:id",
        "method": "GET",
        "module": "ADDRESS-USER",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T03:40:40.900Z",
        "updatedAt": "2024-11-06T03:40:40.900Z",
        "__v": 0
    },
    {
        "_id": "672ae5542b8403083e2f5c9f",
        "name": "Lấy chi tiết địa chỉ mặc định user",
        "apiPath": "/api/v1/address-user/user/default-address",
        "method": "GET",
        "module": "ADDRESS-USER",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T03:41:08.928Z",
        "updatedAt": "2024-11-06T03:41:08.928Z",
        "__v": 0
    },
    {
        "_id": "672ae62b2b8403083e2f5cb3",
        "name": "Cật nhập địa chỉ mặc định user",
        "apiPath": "/api/v1/address-user/user/default/:id",
        "method": "PATCH",
        "module": "ADDRESS-USER",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T03:44:43.618Z",
        "updatedAt": "2024-11-06T03:44:43.618Z",
        "__v": 0
    },
    {
        "_id": "672aef4b2b8403083e2f5d9f",
        "name": "Tạo mới địa chỉ user",
        "apiPath": "/api/v1/address-user",
        "method": "POST",
        "module": "ADDRESS-USER",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T04:23:39.019Z",
        "updatedAt": "2024-11-06T04:23:39.019Z",
        "__v": 0
    },
    {
        "_id": "672aef6a2b8403083e2f5da7",
        "name": "Xóa địa chỉ user",
        "apiPath": "/api/v1/address-user/user/remove/:id",
        "method": "DELETE",
        "module": "ADDRESS-USER",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T04:24:10.805Z",
        "updatedAt": "2024-11-06T04:24:10.805Z",
        "__v": 0
    },
    {
        "_id": "672aefab2b8403083e2f5daf",
        "name": "Lấy danh sách permission",
        "apiPath": "/api/v1/permissions",
        "method": "GET",
        "module": "PERMISSIONS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T04:25:15.237Z",
        "updatedAt": "2024-11-06T04:25:15.237Z",
        "__v": 0
    },
    {
        "_id": "672aefb92b8403083e2f5db1",
        "name": "Lấy chi tiết permission",
        "apiPath": "/api/v1/permissions/:id",
        "method": "GET",
        "module": "PERMISSIONS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T04:25:29.198Z",
        "updatedAt": "2024-11-06T04:25:29.198Z",
        "__v": 0
    },
    {
        "_id": "672aeffb2b8403083e2f5db9",
        "name": "Tạo mới permission",
        "apiPath": "/api/v1/permissions",
        "method": "POST",
        "module": "PERMISSIONS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T04:26:35.127Z",
        "updatedAt": "2024-11-06T04:26:35.127Z",
        "__v": 0
    },
    {
        "_id": "672af0222b8403083e2f5dc1",
        "name": "Cập nhật permission",
        "apiPath": "/api/v1/permissions/:id",
        "method": "PATCH",
        "module": "PERMISSIONS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T04:27:14.946Z",
        "updatedAt": "2024-11-06T04:27:14.946Z",
        "__v": 0
    },
    {
        "_id": "672af0482b8403083e2f5dc3",
        "name": "Xóa 1 permission",
        "apiPath": "/api/v1/permissions/:id",
        "method": "DELETE",
        "module": "PERMISSIONS",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T04:27:52.742Z",
        "updatedAt": "2024-11-06T04:27:52.742Z",
        "__v": 0
    },
    {
        "_id": "672af09f2b8403083e2f5dd1",
        "name": "Xóa 1 role",
        "apiPath": "/api/v1/roles/:id",
        "method": "DELETE",
        "module": "ROLES",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T04:29:19.691Z",
        "updatedAt": "2024-11-06T04:29:19.691Z",
        "__v": 0
    },
    {
        "_id": "672af0b32b8403083e2f5dd3",
        "name": "Cật nhật 1 role",
        "apiPath": "/api/v1/roles/:id",
        "method": "PATCH",
        "module": "ROLES",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T04:29:39.393Z",
        "updatedAt": "2024-11-06T04:29:39.393Z",
        "__v": 0
    },
    {
        "_id": "672af0cf2b8403083e2f5ddb",
        "name": "Lấy thông tin chi tiết 1 role",
        "apiPath": "/api/v1/roles/:id",
        "method": "GET",
        "module": "ROLES",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T04:30:07.511Z",
        "updatedAt": "2024-11-06T04:30:07.511Z",
        "__v": 0
    },
    {
        "_id": "672af0e82b8403083e2f5ddd",
        "name": "Lấy danh sách role",
        "apiPath": "/api/v1/roles",
        "method": "GET",
        "module": "ROLES",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T04:30:32.529Z",
        "updatedAt": "2024-11-06T04:30:32.529Z",
        "__v": 0
    },
    {
        "_id": "672af0fb2b8403083e2f5ddf",
        "name": "Tạo một role",
        "apiPath": "/api/v1/roles",
        "method": "POST",
        "module": "ROLES",
        "createdBy": {
            "_id": "671b34eb52ab878a12a3004a",
            "email": "uyenbao4a5@gmail.com"
        },
        "isDeleted": false,
        "deletedAt": null,
        "createdAt": "2024-11-06T04:30:51.212Z",
        "updatedAt": "2024-11-06T04:30:51.212Z",
        "__v": 0
    }
]
export enum RECEIPT_STATUS {
    CONFIRMED = 'CONFIRMED', //ĐƠN HÀNG ĐÃ XÁC NHẬN
    UNCONFIRMED = 'UNCONFIRMED', // ĐƠN HÀNG MỚI
    PREPARE = 'PREPARE', // SHOP ĐANG CHUẨN BỊ HÀNG 4
    ON_DELIVERY = 'ON_DELIVERY', // ĐANG GIAO HÀNG 3
    DELIVERED = 'DELIVERED', // ĐÃ GIAO HÀNG THÀNH CÔNG 2
    CANCEL = 'CANCEL', // HỦY ĐƠN HÀNG 1
}
export enum TYPE_COUPONS {
    PRICE = 'PRICE',
    PERCENT = 'PERCENT',
}
export enum PAYMENT_METHOD {
    COD = 'COD',
    VNPAY = 'VNPAY',
}
export enum INVENTORY_ACTION {
    IMPORT = 'IMPORT',
    EXPORT = 'EXPORT'
}
export enum TYPE_GENDER {
    FEMALE = 'FEMALE',
    MALE = 'MALE',
    OTHER = 'OTHER',
}

export enum MESSAGE_TYPES {
    TEXT = 'text',
    FILE = 'file',
}

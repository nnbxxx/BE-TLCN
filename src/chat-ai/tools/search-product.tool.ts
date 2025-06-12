import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/modules/products/schemas/product.schemas';
import { InventoryProduct } from 'src/modules/inventory-product/schemas/inventory-product.schemas';

@Injectable()
export class SearchProductTool extends DynamicStructuredTool {
    name = 'search_product_tool';
    description = 'Tìm sản phẩm theo màu sắc, size, khoảng giá, hoặc từ khóa mô tả, tên, thương hiệu';

    constructor(
        @InjectModel(InventoryProduct.name)
        private readonly inventoryModel: Model<InventoryProduct>,
        @InjectModel(Product.name)
        private readonly productModel: Model<Product>
    ) {
        super({
            name: 'search_product_tool',
            description: 'Tìm sản phẩm theo thuộc tính kho (màu, size, giá) và thông tin mô tả (tên, thương hiệu, mô tả)',
            schema: z.object({
                color: z.string().optional().describe('Màu sắc sản phẩm (ví dụ: đỏ -> convert sang mã màu, xanh-> convert sang mã màu , #ff0000, ...)'),
                size: z.string().optional().describe('Kích thước sản phẩm (M, L, XL...)'),
                minPrice: z.number().optional().describe('Giá bán tối thiểu'),
                maxPrice: z.number().optional().describe('Giá bán tối đa'),
                keyword: z.string().optional().describe('Từ khóa tìm kiếm trong tên, mô tả, thương hiệu, ví dụ tìm áo, tìm quần ,....'),
            }),
            func: async (input) => {
                const { color, size, minPrice, maxPrice, keyword } = input;

                // --- Bước 1: nếu có keyword → tìm Product trước ---
                let productIds: string[] | undefined = undefined;
                if (keyword) {
                    const productQuery: any = {
                        isDeleted: false,
                        $or: [
                            { name: { $regex: keyword, $options: 'i' } },
                            { description: { $regex: keyword, $options: 'i' } },
                            { brand: { $regex: keyword, $options: 'i' } },
                            { tags: { $regex: keyword, $options: 'i' } },
                            { features: { $regex: keyword, $options: 'i' } },
                        ],
                    };
                    const products = await this.productModel.find(productQuery).select('_id').lean();
                    productIds = products.map((p) => p._id.toString());
                    if (productIds.length === 0) {
                        return 'Không tìm thấy sản phẩm nào phù hợp với từ khóa.';
                    }
                }

                // --- Bước 2: tìm theo kho với điều kiện từ bước 1 ---
                const query: any = {};

                if (productIds) {
                    query.productId = { $in: productIds };
                }

                query.productVariants = {
                    $elemMatch: {
                        ...(color && { 'attributes.color': color }),
                        ...(size && { 'attributes.size': size }),
                        ...(minPrice !== undefined && { sellPrice: { $gte: minPrice } }),
                        ...(maxPrice !== undefined && {
                            sellPrice: {
                                ...(minPrice !== undefined ? { $gte: minPrice } : {}),
                                $lte: maxPrice
                            }
                        }),
                    }
                };

                const results = await this.inventoryModel
                    .find(query)
                    .limit(10)
                    .populate({
                        path: 'productId',
                        select: 'name images brand description category',
                        populate: {
                            path: 'category',
                            select: 'name'
                        }
                    })
                    .lean();

                if (results.length === 0) return 'Không tìm thấy sản phẩm nào phù hợp.';

                const formatted = results.map((item, index) => {
                    const product = item.productId as any;
                    return `${index + 1}. ${product.name} - Thương hiệu: ${product.brand}, Danh mục: ${product.category?.name || 'Không rõ'}\nID: ${product._id}\nMô tả: ${product.description}\nHình ảnh: ${product.images?.[0] || 'Không có'}\n`;
                });

                return `Đã tìm thấy ${formatted.length} sản phẩm:\n\n` + formatted.join('\n');
            }
        });
    }
}

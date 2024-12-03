import { Injectable, NotFoundException } from "@nestjs/common";
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';

//source code tham khảo: https://medium.com/codex/how-to-upload-images-to-cloudinary-using-nestjs-9f496460e8d7
// ADD
import * as streamifier from 'streamifier';
import { CloudinaryResponse } from "./cloudinary-response";

@Injectable()
export class CloudinaryService {
    uploadFile(file: Express.Multer.File, folder: string): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            let resourceType: string;

            // Kiểm tra MIME type của file để xác định loại resource
            if (file.mimetype.startsWith('image/')) {
                resourceType = 'image';
            } else if (file.mimetype.startsWith('video/')) {
                resourceType = 'video';
            } else {
                resourceType = 'raw'; // Dùng cho tài liệu hoặc các file khác
            }

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder, resource_type: resourceType as any,
                    transformation: [
                        { width: 736, height: 1104, crop: 'pad', background: 'auto' } // Tăng kích thước ảnh và thêm nền nếu cần
                    ]
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });

    }

    async uploadMultipleFile(files: Express.Multer.File[], folder: string): Promise<string[]> {
        const uploadedResults = await Promise.all(files.map((file) => this.uploadFile(file, folder)));
        const result: string[] = uploadedResults.map(item => item.url);

        return result;
    }


    destroy(publicId: string): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            cloudinary.uploader.destroy(
                publicId,
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }

    async deleteImageOnCloud(url: string): Promise<void> {
        const publicId = extractPublicId(url);
        const result = await this.destroy(publicId);

        if (result.result !== 'ok') throw new NotFoundException("Delete Image Cloudinary Fail");
    }
}
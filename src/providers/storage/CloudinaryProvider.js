import { StorageProvider } from "./StorageProvider.js";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env.js";

cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret
});

export class CloudinaryProvider extends StorageProvider {
    async uploadImage(buffer, filename) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "products",
                    public_id: filename.split(".")[0], // Remove extension for Cloudinary public ID
                    format: "webp" // Ensure Cloudinary knows it's webp
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id
                    });
                }
            );

            uploadStream.end(buffer);
        });
    }

    async deleteImage(publicId) {
        if (!publicId) return;
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    }
}

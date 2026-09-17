import sharp from "sharp";

export class ImageProcessor {
    /**
     * Process an image buffer: resize, compress, and convert to WebP
     * @param {Buffer} buffer - The original image buffer
     * @param {number} quality - WebP quality (1-100)
     * @returns {Promise<Buffer>} - The processed image buffer in WebP format
     */
    static async processImage(buffer, quality = 85) {
        return sharp(buffer)
            .webp({ quality })
            .toBuffer();
    }
    
    /**
     * Check if an image is already WebP
     */
    static async isWebP(buffer) {
        const metadata = await sharp(buffer).metadata();
        return metadata.format === "webp";
    }
}

export class StorageProvider {
    /**
     * Upload an image to storage
     * @param {Buffer} buffer - The image buffer (WebP format)
     * @param {string} filename - The filename to save as
     * @returns {Promise<{url: string, publicId?: string}>}
     */
    async uploadImage(buffer, filename) {
        throw new Error("uploadImage not implemented");
    }

    /**
     * Delete an image from storage
     * @param {string} publicId - The public ID or filename of the image
     * @returns {Promise<void>}
     */
    async deleteImage(publicId) {
        throw new Error("deleteImage not implemented");
    }
}

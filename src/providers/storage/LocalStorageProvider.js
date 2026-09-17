import { StorageProvider } from "./StorageProvider.js";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

export class LocalStorageProvider extends StorageProvider {
    constructor(uploadDir = "uploads") {
        super();
        this.uploadDir = path.resolve(process.cwd(), uploadDir);
        this.ensureUploadDir();
    }

    async ensureUploadDir() {
        if (!fs.existsSync(this.uploadDir)) {
            await mkdirAsync(this.uploadDir, { recursive: true });
        }
    }

    async uploadImage(buffer, filename) {
        await this.ensureUploadDir();
        const filePath = path.join(this.uploadDir, filename);
        await writeFileAsync(filePath, buffer);
        
        // In a real app, you would return the URL path based on your static server setup.
        // Assuming static files are served from /uploads
        return {
            url: `/uploads/${filename}`,
            publicId: filename
        };
    }

    async deleteImage(publicId) {
        const filePath = path.join(this.uploadDir, publicId);
        if (fs.existsSync(filePath)) {
            await unlinkAsync(filePath);
        }
    }
}

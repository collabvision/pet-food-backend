import { env } from "../../config/env.js";
import { CloudinaryProvider } from "./CloudinaryProvider.js";
import { LocalStorageProvider } from "./LocalStorageProvider.js";
import { ImageProcessor } from "./ImageProcessor.js";

let storageProvider;

if (env.storageProvider === "cloudinary") {
    storageProvider = new CloudinaryProvider();
} else {
    storageProvider = new LocalStorageProvider();
}

const imageProcessor = new ImageProcessor();

export { storageProvider, imageProcessor };

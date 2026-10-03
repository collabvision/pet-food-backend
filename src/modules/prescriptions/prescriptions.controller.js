import sharp from "sharp";

import {
    uploadPrescription,
    getMyPrescriptions,
    getMyCurrentPrescriptions,
    getPrescriptionById,
    getAllPrescriptions,
    reviewPrescription,
    getCurrentPrescriptionForProduct,
} from "./prescriptions.service.js";

import {
    imageProcessor,
} from "../../providers/storage/index.js";

import path from "path";
import fs from "fs/promises";

export async function uploadPrescriptionController(req, res) {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Prescription image is required",
        });
    }

    if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({
            success: false,
            message: "Only image files are allowed",
        });
    }

    // Convert and compress the uploaded image to WebP.
    const processedBuffer = await imageProcessor.processImage(
        req.file.buffer
    );

    // Verify the resulting image format.
    const metadata = await sharp(processedBuffer).metadata();

    if (metadata.format !== "webp") {
        return res.status(400).json({
            success: false,
            message: "Image processing did not produce WebP",
        });
    }

    // Pass the processed file to the service.
    const processedFile = {
        buffer: processedBuffer,
        mimetype: "image/webp",
        originalname: req.file.originalname,
        size: processedBuffer.length,
    };

    const prescription = await uploadPrescription(
        req.user.id,
        req.body,
        processedFile
    );

    return res.status(201).json({
        success: true,
        message: "Prescription uploaded successfully. It is under review.",
        data: prescription,
    });
}

export async function getMyPrescriptionsController(req, res) {
    const prescriptions = await getMyPrescriptions(req.user.id);

    return res.status(200).json({
        success: true,
        data: prescriptions,
    });
}

/**
 * GET /prescriptions/current
 * Returns ONLY isCurrent=true prescriptions — used by the cart page.
 * Consumed/historical records are excluded so the UI shows accurate status.
 */
export async function getMyCurrentPrescriptionsController(req, res) {
    const prescriptions = await getMyCurrentPrescriptions(req.user.id);

    return res.status(200).json({
        success: true,
        data: prescriptions,
    });
}

/**
 * GET /prescriptions/product/:productId
 * Returns the current (latest) prescription for the authenticated user + product.
 */
export async function getPrescriptionByProductController(req, res) {
    const prescription = await getCurrentPrescriptionForProduct(
        req.user.id,
        req.params.productId
    );

    return res.status(200).json({
        success: true,
        data: prescription || null,
    });
}

export async function getPrescriptionByIdController(req, res) {
    const prescription = await getPrescriptionById(
        req.params.prescriptionId,
        req.user.id,
        req.user.role
    );

    return res.status(200).json({
        success: true,
        data: prescription,
    });
}

export async function getAllPrescriptionsController(req, res) {
    const prescriptions = await getAllPrescriptions();

    return res.status(200).json({
        success: true,
        data: prescriptions,
    });
}

export async function reviewPrescriptionController(req, res) {
    const prescription = await reviewPrescription(
        req.params.prescriptionId,
        req.user.id,
        req.body
    );

    return res.status(200).json({
        success: true,
        message: `Prescription ${req.body.status === "APPROVED" ? "approved" : "rejected"} successfully`,
        data: prescription,
    });
}

export async function getPrescriptionImageController(req, res) {
    const prescription = await getPrescriptionById(
        req.params.prescriptionId,
        req.user.id,
        req.user.role
    );

    const uploadDirectory = path.resolve("uploads", "prescriptions");
    const imagePath = path.resolve(prescription.storagePath);
    const relativePath = path.relative(uploadDirectory, imagePath);

    // Prevent paths outside the prescription upload directory
    if (
        relativePath.startsWith("..") ||
        path.isAbsolute(relativePath)
    ) {
        return res.status(403).json({
            success: false,
            message: "Invalid prescription image path",
        });
    }

    await fs.access(imagePath);

    res.setHeader("Content-Type", "image/webp");
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");

    return res.sendFile(imagePath);
}
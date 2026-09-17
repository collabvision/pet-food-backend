import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

import { ApiError } from "../../utils/ApiError.js";

import {
    createPrescription,
    findPrescriptionById,
    findUserPrescriptions,
    findAllPrescriptions,
    findPrescriptionByOrderAndProduct,
    updatePrescriptionById
} from "./prescriptions.repository.js";

const UPLOAD_DIRECTORY = path.resolve(
    "uploads",
    "prescriptions"
);

function generateFileName() {
    return `${crypto.randomUUID()}.webp`;
}

export async function uploadPrescription(
    userId,
    data,
    file
) {
    if (!file) {
        throw new ApiError(
            400,
            "Prescription image is required"
        );
    }

    if (file.mimetype !== "image/webp") {
        throw new ApiError(
            400,
            "Prescription must be a WebP image"
        );
    }

    if (!data.productId) {
        throw new ApiError(
            400,
            "Product ID is required"
        );
    }

    const existing =
        data.orderId
            ? await findPrescriptionByOrderAndProduct(
                  data.orderId,
                  data.productId,
                  userId
              )
            : null;

    if (existing) {
        throw new ApiError(
            409,
            "Prescription already exists for this order and product"
        );
    }

    await fs.mkdir(
        UPLOAD_DIRECTORY,
        {
            recursive: true
        }
    );

    const fileName = generateFileName();

    const storagePath = path.join(
        UPLOAD_DIRECTORY,
        fileName
    );

    await fs.writeFile(
        storagePath,
        file.buffer
    );

    try {
        const prescription =
            await createPrescription({
                userId,
                orderId: data.orderId || null,
                productId: data.productId,
                fileName,
                originalName:
                    file.originalname,
                mimeType: "image/webp",
                fileSize: file.size,
                storagePath,
                status: "PENDING"
            });

        return prescription;
    } catch (error) {
        await fs.unlink(storagePath).catch(() => {});
        throw error;
    }
}

export async function getMyPrescriptions(userId) {
    return findUserPrescriptions(userId);
}

export async function getPrescriptionById(
    prescriptionId,
    userId,
    role
) {
    const prescription =
        await findPrescriptionById(
            prescriptionId
        );

    if (!prescription) {
        throw new ApiError(
            404,
            "Prescription not found"
        );
    }

    if (
        role !== "ADMIN" &&
        prescription.userId.toString() !==
            userId.toString()
    ) {
        throw new ApiError(
            403,
            "Access denied"
        );
    }

    return prescription;
}

export async function getAllPrescriptions() {
    return findAllPrescriptions();
}

export async function reviewPrescription(
    prescriptionId,
    adminId,
    data
) {
    const prescription =
        await findPrescriptionById(
            prescriptionId
        );

    if (!prescription) {
        throw new ApiError(
            404,
            "Prescription not found"
        );
    }

    if (
        prescription.status !== "PENDING"
    ) {
        throw new ApiError(
            400,
            "Prescription has already been reviewed"
        );
    }

    return updatePrescriptionById(
        prescriptionId,
        {
            status: data.status,
            adminNote:
                data.adminNote || null,
            reviewedBy: adminId,
            reviewedAt: new Date()
        }
    );
}
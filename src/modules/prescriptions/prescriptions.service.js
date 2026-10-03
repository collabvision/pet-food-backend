import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

import { ApiError } from "../../utils/ApiError.js";
import { Product } from "../products/product.model.js";

import {
  createPrescription,
  findPrescriptionById,
  findUserPrescriptions,
  findCurrentUserPrescriptions,
  findAllPrescriptions,
  updatePrescriptionById,
  findCurrentPrescriptionByUserAndProduct,
  findPrescriptionHistoryByUserAndProduct,
  countPrescriptionsByUserAndProduct,
  supersedePrescriptionsByUserAndProduct,
} from "./prescriptions.repository.js";

const UPLOAD_DIRECTORY = path.resolve("uploads", "prescriptions");

function generateFileName() {
  return `${crypto.randomUUID()}.webp`;
}

/**
 * Upload a prescription for a user+product pair.
 *
 * Versioning rules:
 * - Any previous prescriptions for the same user+product are marked
 *   isCurrent=false (superseded).
 * - The new record is created with isCurrent=true, status=PENDING, and a
 *   version number one higher than the previous count.
 *
 * Security: the product is verified server-side to actually require a
 * prescription so users cannot upload prescriptions for non-prescription
 * products.
 */
export async function uploadPrescription(userId, data, file) {
  if (!file?.buffer) {
    throw new ApiError(400, "Prescription image is required");
  }

  if (file.mimetype !== "image/webp") {
    throw new ApiError(400, "Prescription must be a WebP image");
  }

  if (!data.productId) {
    throw new ApiError(400, "Product ID is required");
  }

  // Server-side: verify the product exists and requires a prescription.
  const product = await Product.findById(data.productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!product.requiresPrescription) {
    throw new ApiError(
      400,
      "This product does not require a prescription"
    );
  }

  if (product.isActive === false) {
    throw new ApiError(400, "Product is not available");
  }

  // Determine next version number BEFORE superseding.
  const previousCount = await countPrescriptionsByUserAndProduct(
    userId,
    data.productId
  );
  const nextVersion = previousCount + 1;

  // Supersede all current prescriptions for this user+product so the new
  // upload becomes the sole isCurrent=true record.
  await supersedePrescriptionsByUserAndProduct(userId, data.productId);

  await fs.mkdir(UPLOAD_DIRECTORY, {
    recursive: true,
  });

  const fileName = generateFileName();
  const storagePath = path.join(UPLOAD_DIRECTORY, fileName);

  await fs.writeFile(storagePath, file.buffer);

  try {
    return await createPrescription({
      userId,
      orderId: data.orderId || null,
      productId: data.productId,
      fileName,
      originalName: file.originalname,
      mimeType: "image/webp",
      fileSize: file.buffer.length,
      storagePath,
      status: "PENDING",
      isCurrent: true,
      version: nextVersion,
    });
  } catch (error) {
    // If DB write fails, clean up the orphaned file.
    await fs.unlink(storagePath).catch(() => {});

    // Attempt to re-activate the most recently superseded prescription so
    // the user is not left with no current prescription.
    await findUserPrescriptions(userId)
      .then(async (prev) => {
        const latest = prev.find(
          (p) => p.productId.toString() === data.productId.toString()
        );
        if (latest) {
          await updatePrescriptionById(latest._id, { isCurrent: true });
        }
      })
      .catch(() => {});

    throw error;
  }
}

export async function getMyPrescriptions(userId) {
  return findUserPrescriptions(userId);
}

/**
 * Returns only the ACTIVE (isCurrent=true) prescriptions for the user.
 * This is what the cart UI should call — it never shows stale/consumed records.
 */
export async function getMyCurrentPrescriptions(userId) {
  return findCurrentUserPrescriptions(userId);
}

/**
 * Get the current (latest) prescription for a user+product pair.
 * Returns null if no prescription has been uploaded yet.
 */
export async function getCurrentPrescriptionForProduct(userId, productId) {
  return findCurrentPrescriptionByUserAndProduct(userId, productId);
}

/**
 * Return all versions of a prescription for a user+product pair, newest first.
 */
export async function getPrescriptionHistory(userId, productId) {
  return findPrescriptionHistoryByUserAndProduct(userId, productId);
}

export async function getPrescriptionById(prescriptionId, userId, role) {
  const prescription = await findPrescriptionById(prescriptionId);

  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  if (
    role !== "ADMIN" &&
    prescription.userId.toString() !== userId.toString()
  ) {
    throw new ApiError(403, "Access denied");
  }

  return prescription;
}

export async function getAllPrescriptions() {
  return findAllPrescriptions();
}

/**
 * Admin reviews a prescription (APPROVED or REJECTED).
 *
 * Rules:
 * - Only PENDING prescriptions can be reviewed.
 * - Only the current (isCurrent=true) prescription can be reviewed;
 *   superseded records are locked to prevent confusion.
 */
export async function reviewPrescription(prescriptionId, adminId, data) {
  const prescription = await findPrescriptionById(prescriptionId);

  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  if (prescription.status !== "PENDING") {
    throw new ApiError(
      400,
      "Only PENDING prescriptions can be reviewed"
    );
  }

  if (!prescription.isCurrent) {
    throw new ApiError(
      400,
      "This prescription has been superseded by a newer upload and can no longer be reviewed"
    );
  }

  if (data.status === "REJECTED" && !data.adminNote?.trim()) {
    throw new ApiError(400, "A rejection reason is required");
  }

  return updatePrescriptionById(prescriptionId, {
    status: data.status,
    adminNote: data.adminNote?.trim() || null,
    reviewedBy: adminId,
    reviewedAt: new Date(),
  });
}

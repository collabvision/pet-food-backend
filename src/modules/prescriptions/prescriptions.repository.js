import { Prescription } from "./prescription.model.js";

export async function createPrescription(data) {
  return Prescription.create(data);
}

export async function findPrescriptionById(prescriptionId) {
  return Prescription.findById(prescriptionId);
}

export async function findUserPrescriptions(userId) {
  return Prescription.find({
    userId,
  }).sort({
    createdAt: -1,
  });
}

/**
 * Returns ONLY isCurrent=true prescriptions for a user.
 * Used by the cart page — ensures consumed/historical prescriptions
 * never bleed into the active status shown to the user.
 */
export async function findCurrentUserPrescriptions(userId) {
  return Prescription.find({
    userId,
    isCurrent: true,
  }).populate("productId", "name requiresPrescription").sort({
    createdAt: -1,
  });
}

/**
 * Find the current (isCurrent=true) prescription for a specific user+product.
 * Returns null if none exists.
 */
export async function findCurrentPrescriptionByUserAndProduct(
  userId,
  productId
) {
  return Prescription.findOne({
    userId,
    productId,
    isCurrent: true,
  });
}

/**
 * Return all prescription versions for a user+product pair, newest first.
 * Used for audit history displays.
 */
export async function findPrescriptionHistoryByUserAndProduct(
  userId,
  productId
) {
  return Prescription.find({
    userId,
    productId,
  }).sort({ createdAt: -1 });
}

/**
 * Count how many prescriptions already exist for a user+product pair.
 * Used to calculate the next version number.
 */
export async function countPrescriptionsByUserAndProduct(userId, productId) {
  return Prescription.countDocuments({ userId, productId });
}

/**
 * Mark all existing prescriptions for this user+product as superseded.
 * Call BEFORE creating a new prescription record so the new one becomes
 * the sole isCurrent=true record.
 */
export async function supersedePrescriptionsByUserAndProduct(
  userId,
  productId
) {
  return Prescription.updateMany(
    { userId, productId, isCurrent: true },
    { $set: { isCurrent: false } }
  );
}

export async function findAllPrescriptions() {
  return Prescription.find()
    .populate("userId", "name email")
    .populate("productId", "name")
    .sort({
      createdAt: -1,
    });
}

export async function findPrescriptionByOrderAndProduct(
  orderId,
  productId,
  userId,
) {
  return Prescription.findOne({
    orderId,
    productId,
    userId,
  });
}

export async function updatePrescriptionById(prescriptionId, data) {
  return Prescription.findByIdAndUpdate(prescriptionId, data, {
    returnDocument: "after",
    runValidators: true,
  });
}

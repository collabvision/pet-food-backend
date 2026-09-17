import { Prescription } from "./prescription.model.js";

export async function createPrescription(data) {
    return Prescription.create(data);
}

export async function findPrescriptionById(prescriptionId) {
    return Prescription.findById(prescriptionId);
}

export async function findUserPrescriptions(userId) {
    return Prescription.find({
        userId
    }).sort({
        createdAt: -1
    });
}

export async function findAllPrescriptions() {
    return Prescription.find()
        .populate("userId", "name email")
        .populate("productId", "name")
        .sort({
            createdAt: -1
        });
}

export async function findPrescriptionByOrderAndProduct(
    orderId,
    productId,
    userId
) {
    return Prescription.findOne({
        orderId,
        productId,
        userId
    });
}

export async function updatePrescriptionById(
    prescriptionId,
    data
) {
    return Prescription.findByIdAndUpdate(
        prescriptionId,
        data,
        {
            new: true,
            runValidators: true
        }
    );
}
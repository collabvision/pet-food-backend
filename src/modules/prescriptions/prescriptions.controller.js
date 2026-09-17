import {
    uploadPrescription,
    getMyPrescriptions,
    getPrescriptionById,
    getAllPrescriptions,
    reviewPrescription
} from "./prescriptions.service.js";

import { storageProvider, imageProcessor } from "../../providers/storage/index.js";

export async function uploadPrescriptionController(
    req,
    res
) {
    let fileUrl = null;
    if (req.file) {
        if (req.file.mimetype.startsWith("image/")) {
            const processed = await imageProcessor.processImage(req.file.buffer);
            const uploaded = await storageProvider.uploadImage(processed, req.file.originalname);
            fileUrl = uploaded.url;
        } else {
            // pdf handling or direct upload
            const uploaded = await storageProvider.uploadImage(req.file.buffer, req.file.originalname);
            fileUrl = uploaded.url;
        }
    }

    const prescription =
        await uploadPrescription(
            req.user.id,
            req.body,
            fileUrl
        );

    res.status(201).json({
        success: true,
        message:
            "Prescription uploaded successfully",
        data: prescription
    });
}

export async function getMyPrescriptionsController(
    req,
    res
) {
    const prescriptions =
        await getMyPrescriptions(
            req.user.id
        );

    res.status(200).json({
        success: true,
        data: prescriptions
    });
}

export async function getPrescriptionByIdController(
    req,
    res
) {
    const prescription =
        await getPrescriptionById(
            req.params.prescriptionId,
            req.user.id,
            req.user.role
        );

    res.status(200).json({
        success: true,
        data: prescription
    });
}

export async function getAllPrescriptionsController(
    req,
    res
) {
    const prescriptions =
        await getAllPrescriptions();

    res.status(200).json({
        success: true,
        data: prescriptions
    });
}

export async function reviewPrescriptionController(
    req,
    res
) {
    const prescription =
        await reviewPrescription(
            req.params.prescriptionId,
            req.user.id,
            req.body
        );

    res.status(200).json({
        success: true,
        message:
            "Prescription reviewed successfully",
        data: prescription
    });
}
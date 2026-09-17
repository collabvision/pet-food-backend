import { Router } from "express";
import multer from "multer";

import {
    uploadPrescriptionController,
    getMyPrescriptionsController,
    getPrescriptionByIdController,
    getAllPrescriptionsController,
    reviewPrescriptionController
} from "./prescriptions.controller.js";

import {
    createPrescriptionSchema,
    reviewPrescriptionSchema
} from "./prescriptions.validation.js";

import { validate } from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "image/webp") {
            return cb(
                new Error(
                    "Only WebP prescription images are allowed"
                )
            );
        }

        cb(null, true);
    }
});

router.use(authenticate);

router.post(
    "/upload",
    upload.single("prescription"),
    validate(createPrescriptionSchema),
    asyncHandler(
        uploadPrescriptionController
    )
);

router.get(
    "/",
    asyncHandler(
        getMyPrescriptionsController
    )
);

router.get(
    "/admin/all",
    authorize("ADMIN"),
    asyncHandler(
        getAllPrescriptionsController
    )
);

router.patch(
    "/admin/:prescriptionId/review",
    authorize("ADMIN"),
    validate(reviewPrescriptionSchema),
    asyncHandler(
        reviewPrescriptionController
    )
);

router.get(
    "/:prescriptionId",
    asyncHandler(
        getPrescriptionByIdController
    )
);

export default router;
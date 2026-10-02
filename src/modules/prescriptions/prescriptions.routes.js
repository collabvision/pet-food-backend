import { Router } from "express";


import {
    uploadPrescriptionController,
    getMyPrescriptionsController,
    getPrescriptionByIdController,
    getAllPrescriptionsController,
    reviewPrescriptionController,
    getPrescriptionImageController
} from "./prescriptions.controller.js";

import {
    createPrescriptionSchema,
    reviewPrescriptionSchema
} from "./prescriptions.validation.js";

import { validate } from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { upload } from "../../middleware/upload.middleware.js";


const router = Router();



router.use(authenticate);

router.post(
    "/upload",
    upload.single("file"),
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
router.get(
  "/:prescriptionId/image",
  getPrescriptionImageController
);

router.get(
  "/:prescriptionId",
  getPrescriptionByIdController
);

router.patch(
    "/admin/:prescriptionId/review",
    authorize("ADMIN"),
    validate(reviewPrescriptionSchema),
    asyncHandler(reviewPrescriptionController)
);

router.get(
    "/:prescriptionId",
    asyncHandler(getPrescriptionByIdController)
);

export default router;
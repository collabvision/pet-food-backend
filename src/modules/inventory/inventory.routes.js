import { Router } from "express";

import {
    createInventoryController,
    getInventoryController,
    getInventoryByProductController,
    updateInventoryController,
    deleteInventoryController,
    addStockController,
    removeStockController,
    reserveStockController,
    releaseStockController
} from "./inventory.controller.js";

import {
    createInventorySchema,
    updateInventorySchema,
    inventoryProductIdSchema,
    inventoryQuantitySchema
} from "./inventory.validation.js";

import {
    authenticate
} from "../../middleware/auth.middleware.js";

import {
    authorize
} from "../../middleware/role.middleware.js";

import {
    validate,
    validateParams
} from "../../middleware/validate.middleware.js";

import {
    asyncHandler
} from "../../utils/asyncHandler.js";


const router = Router();


router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    asyncHandler(
        getInventoryController
    )
);


router.get(
    "/:productId",
    authenticate,
    authorize("ADMIN"),
    validateParams(
        inventoryProductIdSchema
    ),
    asyncHandler(
        getInventoryByProductController
    )
);


router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    validate(
        createInventorySchema
    ),
    asyncHandler(
        createInventoryController
    )
);


router.patch(
    "/:productId",
    authenticate,
    authorize("ADMIN"),
    validateParams(
        inventoryProductIdSchema
    ),
    validate(
        updateInventorySchema
    ),
    asyncHandler(
        updateInventoryController
    )
);


router.delete(
    "/:productId",
    authenticate,
    authorize("ADMIN"),
    validateParams(
        inventoryProductIdSchema
    ),
    asyncHandler(
        deleteInventoryController
    )
);


router.post(
    "/:productId/add-stock",
    authenticate,
    authorize("ADMIN"),
    validateParams(
        inventoryProductIdSchema
    ),
    validate(
        inventoryQuantitySchema
    ),
    asyncHandler(
        addStockController
    )
);


router.post(
    "/:productId/remove-stock",
    authenticate,
    authorize("ADMIN"),
    validateParams(
        inventoryProductIdSchema
    ),
    validate(
        inventoryQuantitySchema
    ),
    asyncHandler(
        removeStockController
    )
);


router.post(
    "/:productId/reserve",
    authenticate,
    authorize("ADMIN"),
    validateParams(
        inventoryProductIdSchema
    ),
    validate(
        inventoryQuantitySchema
    ),
    asyncHandler(
        reserveStockController
    )
);


router.post(
    "/:productId/release-reservation",
    authenticate,
    authorize("ADMIN"),
    validateParams(
        inventoryProductIdSchema
    ),
    validate(
        inventoryQuantitySchema
    ),
    asyncHandler(
        releaseStockController
    )
);


export default router;
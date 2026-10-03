import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            default: null,
            index: true
        },

        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true
        },

        fileName: {
            type: String,
            required: true,
            trim: true
        },

        originalName: {
            type: String,
            required: true,
            trim: true
        },

        mimeType: {
            type: String,
            required: true,
            enum: ["image/webp"]
        },

        fileSize: {
            type: Number,
            required: true,
            min: 1
        },

        storagePath: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "APPROVED",
                "REJECTED"
            ],
            default: "PENDING",
            index: true
        },

        adminNote: {
            type: String,
            default: null,
            trim: true,
            maxlength: 2000
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        reviewedAt: {
            type: Date,
            default: null
        },

        /**
         * True when this is the active (most-recent) prescription record for
         * this user+product pair.  When the user re-uploads a prescription for
         * the same product, ALL previous records are set to isCurrent=false and
         * the new record is created with isCurrent=true.
         *
         * The order service MUST verify `isCurrent: true` in addition to
         * `status: "APPROVED"` so a superseded APPROVED prescription can never
         * be used to authorise checkout after the user has uploaded a
         * replacement.
         */
        isCurrent: {
            type: Boolean,
            default: true,
            index: true
        },

        /**
         * Sequential version number within the user+product pair.  Starts at 1
         * and increments each time the user re-uploads.  Useful for audit
         * displays and debugging.
         */
        version: {
            type: Number,
            default: 1,
            min: 1
        }
    },
    {
        timestamps: true
    }
);

// Compound index: quickly find the current prescription for a user + product
prescriptionSchema.index({ userId: 1, productId: 1, isCurrent: 1 });
// Quickly find all versions for audit
prescriptionSchema.index({ userId: 1, productId: 1, createdAt: -1 });

export const Prescription = mongoose.model(
    "Prescription",
    prescriptionSchema
);
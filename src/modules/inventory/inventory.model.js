import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            unique: true,
            index: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        reservedQuantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        lowStockThreshold: {
            type: Number,
            required: true,
            min: 0,
            default: 10
        }
    },
    {
        timestamps: true
    }
);

inventorySchema.virtual("availableQuantity").get(function () {
    return Math.max(
        0,
        this.quantity - this.reservedQuantity
    );
});

inventorySchema.set(
    "toJSON",
    {
        virtuals: true
    }
);

export const Inventory =
    mongoose.model("Inventory", inventorySchema);
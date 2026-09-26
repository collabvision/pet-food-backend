import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 200
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        compareAtPrice: {
            type: Number,
            min: 0,
            default: null
        },

        sku: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            index: true
        },

        barcode: {
            type: String,
            trim: true,
            default: null,
            index: true
        },

        images: [
            {
                url: {
                    type: String,
                    required: true
                },
                localUrl: {
                    type: String
                },
                cloudinaryUrl: {
                    type: String
                },
                publicId: {
                    type: String,
                    default: null
                }
            }
        ],

        isMedical: {
            type: Boolean,
            default: false
        },

        requiresPrescription: {
            type: Boolean,
            default: false
        },

        brand: {
            type: String,
            trim: true,
            maxlength: 100,
            default: ""
        },

        unit: {
            type: String,
            trim: true,
            maxlength: 50,
            default: ""
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

productSchema.pre("validate", function (next) {
    if (this.name && (!this.slug || this.isModified("name"))) {
        const baseSlug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
        // Append a short random string to ensure uniqueness
        this.slug = baseSlug + "-" + Math.random().toString(36).substring(2, 6);
    }
    next();
});

productSchema.index({
    name: "text",
    description: "text",
    brand: "text"
});

export const Product = mongoose.model("Product", productSchema);
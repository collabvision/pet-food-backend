import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Home", "Office", "Other"], default: "Home" },
    name: { type: String, trim: true },
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    country: { type: String, trim: true, default: "India" },
    phone: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true },
);

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },

    type: {
      type: String,
      enum: ["Dog", "Cat", "Bird", "Rabbit", "Other"],
      required: true,
    },

    breed: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },

    weight: {
      type: Number,
      min: 0,
      default: null,
    },

    weightUnit: {
      type: String,
      enum: ["kg", "lb"],
      default: "kg",
    },

    imageUrl: {
      type: String,
      default: null,
    },
  },
  {
    _id: true,
  },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    addresses: [addressSchema],

    pets: {
      type: [petSchema],
      validate: {
        validator: function (pets) {
          return pets.length <= 2;
        },
        message: "A user can have maximum 2 pets.",
      },
      default: [],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationTokenHash: {
      type: String,
      default: null,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
      select: false,
    },

    passwordResetTokenHash: {
      type: String,
      default: null,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
      select: false,
    },

    refreshTokenHash: {
      type: String,
      default: null,
      select: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema);

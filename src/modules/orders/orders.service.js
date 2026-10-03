// src/modules/orders/orders.service.js

import crypto from "crypto";

import { ApiError } from "../../utils/ApiError.js";

import {
  createOrder,
  findById,
  findByOrderNumber,
  findByUserId,
  findAllOrders,
  updateOrder,
  saveOrder,
} from "./orders.repository.js";

import { Cart } from "../cart/cart.model.js";
import { Product } from "../products/product.model.js";
import {Prescription} from "../prescriptions/prescription.model.js";

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();

  const random = crypto.randomBytes(4).toString("hex").toUpperCase();

  return `ORD-${timestamp}-${random}`;
}

function calculateTotals(items, shippingCharge, discount) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  const totalAmount = Math.max(0, subtotal + shippingCharge - discount);

  return {
    subtotal,
    shippingCharge,
    discount,
    totalAmount,
  };
}

export const createUserOrder = async (
  userId,
  shippingAddress,
  paymentMethod,
  shippingCharge = 0,
  discount = 0,
  checkoutMode = "ALL",
) => {
  if (!["ALL", "NON_PRESCRIPTION"].includes(checkoutMode)) {
    throw new ApiError(400, "Invalid checkout mode");
  }

  const cart = await Cart.findOne({ userId });

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const productIds = cart.items.map((item) => item.productId);

  const products = await Product.find({
    _id: { $in: productIds },
    isActive: { $ne: false },
  });

  const productMap = new Map(
    products.map((product) => [product._id.toString(), product]),
  );

  const orderItems = [];
  const orderedProductIds = new Set();

  for (const cartItem of cart.items) {
    const product = productMap.get(cartItem.productId.toString());

    if (!product || !product.isActive) {
      throw new ApiError(
        400,
        `Product ${cartItem.productId} is unavailable`,
      );
    }

    // Skip prescription products during non-prescription checkout.
    if (
      checkoutMode === "NON_PRESCRIPTION" &&
      product.requiresPrescription
    ) {
      continue;
    }

    let approvedPrescription = null;

    // Verify approval for prescription-required products.
    // IMPORTANT: we must check isCurrent=true so a superseded APPROVED
    // prescription (from before the user uploaded a replacement) cannot
    // authorize checkout.
    if (product.requiresPrescription) {
      approvedPrescription = await Prescription.findOne({
        userId,
        productId: product._id,
        status: "APPROVED",
        isCurrent: true,
      });

      if (!approvedPrescription) {
        throw new ApiError(
          400,
          `An approved prescription is required for ${product.name}. ` +
          `If you have recently re-uploaded a prescription, an admin must approve the new version before you can order.`,
        );
      }
    }

    const quantity = Number(cartItem.quantity);
    const price = Number(product.price);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ApiError(
        400,
        `Invalid quantity for ${product.name}`,
      );
    }

    if (!Number.isFinite(price) || price < 0) {
      throw new ApiError(
        400,
        `Invalid price for ${product.name}`,
      );
    }

    if (
      product.stock !== undefined &&
      product.stock < quantity
    ) {
      throw new ApiError(
        400,
        `Insufficient stock for ${product.name}`,
      );
    }

    orderItems.push({
      productId: product._id,
      name: product.name,
      price,
      quantity,
      total: price * quantity,
      // Record the exact prescription version that authorised this item.
      // null for non-prescription products.
      prescriptionId: approvedPrescription?._id || null,
    });

    orderedProductIds.add(product._id.toString());
  }

  // This check must be outside the loop.
  if (orderItems.length === 0) {
    throw new ApiError(
      400,
      "No eligible products found for checkout",
    );
  }

  const totals = calculateTotals(
    orderItems,
    shippingCharge,
    discount,
  );

  const order = await createOrder({
    orderNumber: generateOrderNumber(),
    userId,
    items: orderItems,
    shippingAddress,
    ...totals,
    paymentMethod,
    paymentStatus: "PENDING",
    orderStatus: "PENDING",
    statusHistory: [
      {
        status: "PENDING",
        note: "Order created",
        changedBy: userId,
      },
    ],
  });

  // If the payment is COD, we can immediately remove the items from the cart
  // and consume the prescriptions. For ONLINE payment, we preserve them
  // until the payment is successfully verified.
  if (paymentMethod === "COD") {
    // Remove only products included in this order.
    // Skipped prescription products remain in the cart.
    cart.items = cart.items.filter(
      (item) => !orderedProductIds.has(item.productId.toString()),
    );
    await cart.save();

    // Consume the approved prescriptions
    const prescriptionIds = orderItems
      .filter((i) => i.prescriptionId)
      .map((i) => i.prescriptionId);
    
    if (prescriptionIds.length > 0) {
      await Prescription.updateMany(
        { _id: { $in: prescriptionIds } },
        { $set: { isCurrent: false, orderId: order._id } }
      );
    }
  }

  return order;
};

export async function getUserOrder(userId, orderId) {
  const order = await findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.userId.toString() !== userId) {
    throw new ApiError(403, "Access denied");
  }

  return order;
}

export async function getUserOrders(userId) {
  return findByUserId(userId);
}

export async function getOrderByNumber(userId, orderNumber) {
  const order = await findByOrderNumber(orderNumber);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.userId.toString() !== userId) {
    throw new ApiError(403, "Access denied");
  }

  return order;
}

export async function getAdminOrders() {
  return findAllOrders();
}

export async function updateOrderStatus(orderId, status, note, changedBy) {
  const order = await findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (
    order.orderStatus === "DELIVERED" &&
    status !== "RETURN_REQUESTED" &&
    status !== "RETURNED"
  ) {
    throw new ApiError(400, "Delivered order status cannot be changed");
  }

  if (order.orderStatus === "CANCELLED") {
    throw new ApiError(400, "Cancelled order cannot be updated");
  }

  order.orderStatus = status;

  order.statusHistory.push({
    status,
    note,
    changedBy,
    changedAt: new Date(),
  });

  if (status === "DELIVERED") {
    order.deliveredAt = new Date();
  }

  if (status === "CANCELLED") {
    order.cancelledAt = new Date();
  }

  await saveOrder(order);

  return order;
}

export async function cancelUserOrder(userId, orderId) {
  const order = await findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.userId.toString() !== userId) {
    throw new ApiError(403, "Access denied");
  }

  if (["SHIPPED", "DELIVERED", "RETURNED"].includes(order.orderStatus)) {
    throw new ApiError(400, "Order cannot be cancelled at this stage");
  }

  if (order.orderStatus === "CANCELLED") {
    throw new ApiError(400, "Order is already cancelled");
  }

  order.orderStatus = "CANCELLED";
  order.cancelledAt = new Date();

  order.statusHistory.push({
    status: "CANCELLED",
    note: "Cancelled by user",
    changedBy: userId,
    changedAt: new Date(),
  });

  await saveOrder(order);

  return order;
}

import crypto from "crypto";

import { ApiError } from "../../utils/ApiError.js";

import {
    createReturn,
    findReturnById,
    findReturnByNumber,
    findUserReturns,
    findAllReturns,
    findReturnByOrderAndUser,
    updateReturnById
} from "./returns.repository.js";

import {
    findOrderById,
    saveOrder
} from "../orders/orders.repository.js";
import { paymentProvider } from "../../providers/payment/index.js";
import { findByOrderId as findPaymentByOrderId } from "../payments/payments.repository.js";

function generateReturnNumber() {
    const random = crypto.randomBytes(4).toString("hex").toUpperCase();

    return `RET-${Date.now()}-${random}`;
}

function addStatusHistory(
    returnDocument,
    status,
    changedBy,
    note = null
) {
    returnDocument.status = status;

    returnDocument.statusHistory.push({
        status,
        changedBy,
        note,
        changedAt: new Date()
    });
}

export async function requestReturn(userId, data) {
    const order = await findOrderById(data.orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.userId.toString() !== userId.toString()) {
        throw new ApiError(
            403,
            "You cannot request a return for this order"
        );
    }

    if (order.orderStatus !== "DELIVERED") {
        throw new ApiError(
            400,
            "Only delivered orders can be returned"
        );
    }

    // Removed strict PAID check – COD delivered orders should also be returnable

    const existingReturn = await findReturnByOrderAndUser(
        data.orderId,
        userId
    );

    if (existingReturn) {
        throw new ApiError(
            409,
            "A return request already exists for this order"
        );
    }

    const orderItems = new Map(
        order.items.map((item) => [
            item.productId.toString(),
            item
        ])
    );

    for (const requestedItem of data.items) {
        const orderItem = orderItems.get(
            requestedItem.productId
        );

        if (!orderItem) {
            throw new ApiError(
                400,
                "Product is not part of this order"
            );
        }

        if (requestedItem.quantity > orderItem.quantity) {
            throw new ApiError(
                400,
                "Return quantity cannot exceed purchased quantity"
            );
        }
    }

    const refundAmount = data.items.reduce(
        (total, item) => {
            const orderItem = orderItems.get(
                item.productId
            );

            return (
                total +
                orderItem.price * item.quantity
            );
        },
        0
    );

    const returnNumber = generateReturnNumber();

    const returnDocument = await createReturn({
        returnNumber,
        orderId: order._id,
        userId,
        items: data.items,
        reason: data.reason || "DEFECTIVE_PRODUCT",
        description: data.description || data.comments || "",
        refundAmount,
        status: "REQUESTED",
        statusHistory: [
            {
                status: "REQUESTED",
                changedBy: userId,
                note: `Return requested: ${data.reason || "DEFECTIVE_PRODUCT"}`,
                changedAt: new Date()
            }
        ]
    });

    // Also update order status to RETURN_REQUESTED
    order.orderStatus = "RETURN_REQUESTED";
    order.statusHistory.push({
        status: "RETURN_REQUESTED",
        note: "User requested a return",
        changedBy: userId,
        changedAt: new Date()
    });
    await order.save();

    return returnDocument;
}

export async function getMyReturns(userId) {
    return findUserReturns(userId);
}

export async function getReturnById(returnId, userId, role) {
    const returnDocument = await findReturnById(returnId);

    if (!returnDocument) {
        throw new ApiError(404, "Return request not found");
    }

    if (
        role !== "ADMIN" &&
        returnDocument.userId.toString() !== userId.toString()
    ) {
        throw new ApiError(
            403,
            "You cannot access this return request"
        );
    }

    return returnDocument;
}

export async function getReturnByNumber(
    returnNumber,
    userId,
    role
) {
    const returnDocument =
        await findReturnByNumber(returnNumber);

    if (!returnDocument) {
        throw new ApiError(404, "Return request not found");
    }

    if (
        role !== "ADMIN" &&
        returnDocument.userId.toString() !== userId.toString()
    ) {
        throw new ApiError(
            403,
            "You cannot access this return request"
        );
    }

    return returnDocument;
}

export async function getAllReturns() {
    return findAllReturns();
}

export async function updateReturnStatus(
    returnId,
    adminId,
    data
) {
    const returnDocument =
        await findReturnById(returnId);

    if (!returnDocument) {
        throw new ApiError(404, "Return request not found");
    }

    const allowedTransitions = {
        REQUESTED: ["APPROVED", "REJECTED", "CANCELLED"],

        APPROVED: ["PICKUP_PENDING", "CANCELLED"],

        PICKUP_PENDING: ["PICKED_UP", "CANCELLED"],

        PICKED_UP: ["REFUNDED"],

        REJECTED: [],

        REFUNDED: [],

        CANCELLED: []
    };

    const allowed =
        allowedTransitions[returnDocument.status] || [];

    if (!allowed.includes(data.status)) {
        throw new ApiError(
            400,
            `Cannot change return status from ${returnDocument.status} to ${data.status}`
        );
    }

    if (
        data.status === "REFUNDED" &&
        (!data.refundAmount || data.refundAmount <= 0)
    ) {
        throw new ApiError(
            400,
            "Refund amount is required when marking return as refunded"
        );
    }

    if (
        data.refundAmount !== undefined &&
        data.refundAmount > returnDocument.refundAmount
    ) {
        throw new ApiError(
            400,
            "Refund amount cannot exceed the calculated refund amount"
        );
    }

    addStatusHistory(
        returnDocument,
        data.status,
        adminId,
        data.adminNote || null
    );

    if (data.adminNote !== undefined) {
        returnDocument.adminNote = data.adminNote;
    }

    if (data.refundAmount !== undefined) {
        returnDocument.refundAmount = data.refundAmount;
    }

    if (data.refundPaymentId !== undefined) {
        returnDocument.refundPaymentId = data.refundPaymentId;
    }

    // Process Razorpay refund if status is REFUNDED and not manually processed
    if (data.status === "REFUNDED") {
        const order = await findOrderById(returnDocument.orderId);
        
        if (order) {
            // Check if online payment
            if (order.paymentStatus === "PAID" || order.paymentStatus === "AUTHORIZED") {
                const payment = await findPaymentByOrderId(order._id);
                if (payment && payment.razorpayPaymentId) {
                    try {
                        const refund = await paymentProvider.refundPayment(
                            payment.razorpayPaymentId,
                            data.refundAmount,
                            { returnId: returnDocument._id.toString() }
                        );
                        // Save the refund id from Razorpay
                        returnDocument.refundPaymentId = refund.id;
                    } catch (error) {
                        throw new ApiError(500, `Razorpay refund failed: ${error.message}`);
                    }
                }
            }

            // Update order status to RETURNED
            order.orderStatus = "RETURNED";
            order.statusHistory.push({
                status: "RETURNED",
                note: `Return completed and refunded via admin`,
                changedBy: adminId,
                changedAt: new Date()
            });
            await saveOrder(order);
        }
    }

    return returnDocument.save();
}
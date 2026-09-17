import {
    createNotification,
    findUserNotifications,
    findOrderNotifications,
    findAllNotifications,
    findNotificationById
} from "./notifications.repository.js";

import { ConsoleEmailProvider } from "../../providers/email/ConsoleEmailProvider.js";
import { ConsoleWhatsAppProvider } from "../../providers/whatsapp/ConsoleWhatsAppProvider.js";

import { ApiError } from "../../utils/ApiError.js";

const emailProvider =
    new ConsoleEmailProvider();

const whatsappProvider =
    new ConsoleWhatsAppProvider();

function createOrderStatusMessage({
    orderNumber,
    orderStatus
}) {
    return `Your order ${orderNumber} status has been updated to ${orderStatus}.`;
}

export async function sendOrderStatusNotification(
    data
) {
    const message =
        createOrderStatusMessage(data);

    const subject =
        `Order ${data.orderNumber} status updated`;

    const results = [];

    // EMAIL
    try {
        const emailResult =
            await emailProvider.sendEmail({
                to: data.email,
                subject,
                text: message
            });

        await createNotification({
            userId: data.userId,
            orderId: data.orderId,
            channel: "EMAIL",
            type: "ORDER_STATUS",
            status: "SENT",
            recipient: data.email,
            subject,
            message,
            provider:
                emailResult.provider,
            sentAt: new Date()
        });

        results.push({
            channel: "EMAIL",
            status: "SENT"
        });
    } catch (error) {
        await createNotification({
            userId: data.userId,
            orderId: data.orderId,
            channel: "EMAIL",
            type: "ORDER_STATUS",
            status: "FAILED",
            recipient: data.email,
            subject,
            message,
            provider: "console",
            errorMessage:
                error.message
        });

        results.push({
            channel: "EMAIL",
            status: "FAILED"
        });
    }

    // WHATSAPP
    try {
        const whatsappResult =
            await whatsappProvider.sendMessage({
                to: data.phone,
                message
            });

        await createNotification({
            userId: data.userId,
            orderId: data.orderId,
            channel: "WHATSAPP",
            type: "ORDER_STATUS",
            status: "SENT",
            recipient: data.phone,
            message,
            provider:
                whatsappResult.provider,
            sentAt: new Date()
        });

        results.push({
            channel: "WHATSAPP",
            status: "SENT"
        });
    } catch (error) {
        await createNotification({
            userId: data.userId,
            orderId: data.orderId,
            channel: "WHATSAPP",
            type: "ORDER_STATUS",
            status: "FAILED",
            recipient: data.phone,
            message,
            provider: "console",
            errorMessage:
                error.message
        });

        results.push({
            channel: "WHATSAPP",
            status: "FAILED"
        });
    }

    return {
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        orderStatus: data.orderStatus,
        results
    };
}

export async function getMyNotifications(
    userId
) {
    return findUserNotifications(userId);
}

export async function getNotificationById(
    notificationId,
    userId,
    role
) {
    const notification =
        await findNotificationById(
            notificationId
        );

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    if (
        role !== "ADMIN" &&
        notification.userId.toString() !==
            userId.toString()
    ) {
        throw new ApiError(
            403,
            "Access denied"
        );
    }

    return notification;
}

export async function getOrderNotifications(
    orderId
) {
    return findOrderNotifications(orderId);
}

export async function getAllNotifications() {
    return findAllNotifications();
}
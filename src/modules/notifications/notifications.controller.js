import {
    sendOrderStatusNotification,
    getMyNotifications,
    getNotificationById,
    getOrderNotifications,
    getAllNotifications
} from "./notifications.service.js";

export async function sendOrderStatusNotificationController(
    req,
    res
) {
    const result =
        await sendOrderStatusNotification(
            req.body
        );

    res.status(200).json({
        success: true,
        message:
            "Order status notifications processed",
        data: result
    });
}

export async function getMyNotificationsController(
    req,
    res
) {
    const notifications =
        await getMyNotifications(
            req.user.id
        );

    res.status(200).json({
        success: true,
        data: notifications
    });
}

export async function getNotificationByIdController(
    req,
    res
) {
    const notification =
        await getNotificationById(
            req.params.notificationId,
            req.user.id,
            req.user.role
        );

    res.status(200).json({
        success: true,
        data: notification
    });
}

export async function getOrderNotificationsController(
    req,
    res
) {
    const notifications =
        await getOrderNotifications(
            req.params.orderId
        );

    res.status(200).json({
        success: true,
        data: notifications
    });
}

export async function getAllNotificationsController(
    req,
    res
) {
    const notifications =
        await getAllNotifications();

    res.status(200).json({
        success: true,
        data: notifications
    });
}
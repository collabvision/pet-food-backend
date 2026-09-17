import { Notification } from "./notification.model.js";

export async function createNotification(data) {
    return Notification.create(data);
}

export async function findNotificationById(
    notificationId
) {
    return Notification.findById(
        notificationId
    );
}

export async function findUserNotifications(
    userId
) {
    return Notification.find({
        userId
    }).sort({
        createdAt: -1
    });
}

export async function findOrderNotifications(
    orderId
) {
    return Notification.find({
        orderId
    }).sort({
        createdAt: -1
    });
}

export async function findAllNotifications() {
    return Notification.find().sort({
        createdAt: -1
    });
}

export async function updateNotificationById(
    notificationId,
    data
) {
    return Notification.findByIdAndUpdate(
        notificationId,
        data,
        {
            new: true,
            runValidators: true
        }
    );
}
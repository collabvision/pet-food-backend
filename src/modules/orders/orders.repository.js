import { Order } from "./order.model.js";

export async function createOrder(data) {
    return Order.create(data);
}

export async function findById(orderId) {
    return Order.findById(orderId);
}

export async function findOrderById(orderId) {
    return Order.findById(orderId);
}

export async function findByOrderNumber(orderNumber) {
    return Order.findOne({ orderNumber });
}

export async function findByNumber(orderNumber) {
    return Order.findOne({ orderNumber });
}

export async function findOrderByNumber(orderNumber) {
    return Order.findOne({ orderNumber });
}

export async function findByUserId(userId) {
    return Order.find({
        userId
    }).sort({
        createdAt: -1
    });
}

export async function findOrdersByUser(userId) {
    return Order.find({
        userId
    }).sort({
        createdAt: -1
    });
}

export async function findAll() {
    return Order.find().sort({
        createdAt: -1
    });
}

export async function findAllOrders() {
    return Order.find().sort({
        createdAt: -1
    });
}

export async function updateOrder(orderId, data) {
    return Order.findByIdAndUpdate(
        orderId,
        data,
        {
            new: true,
            runValidators: true
        }
    );
}

export async function updateById(orderId, data) {
    return Order.findByIdAndUpdate(
        orderId,
        data,
        {
            new: true,
            runValidators: true
        }
    );
}

export async function updateOrderById(orderId, data) {
    return Order.findByIdAndUpdate(
        orderId,
        data,
        {
            new: true,
            runValidators: true
        }
    );
}

export async function saveOrder(order) {
    return order.save();
}

export async function deleteById(orderId) {
    return Order.findByIdAndDelete(orderId);
}

export async function deleteOrderById(orderId) {
    return Order.findByIdAndDelete(orderId);
}
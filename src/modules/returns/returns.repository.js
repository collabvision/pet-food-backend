import { Return } from "./return.model.js";

export async function createReturn(data) {
    return Return.create(data);
}

export async function findReturnById(returnId) {
    return Return.findById(returnId);
}

export async function findReturnByNumber(returnNumber) {
    return Return.findOne({ returnNumber });
}

export async function findUserReturns(userId) {
    return Return.find({ userId }).sort({ createdAt: -1 });
}

export async function findAllReturns() {
    return Return.find().sort({ createdAt: -1 });
}

export async function findReturnByOrderAndUser(orderId, userId) {
    return Return.findOne({
        orderId,
        userId
    });
}

export async function updateReturnById(returnId, data) {
    return Return.findByIdAndUpdate(
        returnId,
        data,
        {
            new: true,
            runValidators: true
        }
    );
}
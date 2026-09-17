import {
    PendingRegistration
} from "./pendingRegistration.model.js";

export async function createPendingRegistration(data) {
    return PendingRegistration.create(data);
}

export async function findPendingByEmail(email) {
    return PendingRegistration.findOne({ email });
}

export async function deletePendingByEmail(email) {
    return PendingRegistration.deleteOne({ email });
}

export async function updatePendingByEmail(
    email,
    data
) {
    return PendingRegistration.findOneAndUpdate(
        { email },
        data,
        {
            new: true,
            runValidators: true
        }
    );
}
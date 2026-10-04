import { ApiError } from "../../utils/ApiError.js";
import {
    findAllUsers,
    findUserById,
    updateUserById,
    countUsers,
} from "./users.repository.js";

export async function getAllUsersService({ page, limit, search } = {}) {
    return findAllUsers({ page, limit, search });
}

export async function getUserByIdService(id) {
    const user = await findUserById(id);
    if (!user) throw new ApiError(404, "User not found");
    return user;
}

export async function updateUserService(id, data) {
    const user = await findUserById(id);
    if (!user) throw new ApiError(404, "User not found");

    // Only allow safe fields to be updated by admin
    const allowedFields = ["isActive", "role"];
    const filteredData = {};
    for (const key of allowedFields) {
        if (data[key] !== undefined) filteredData[key] = data[key];
    }

    return updateUserById(id, filteredData);
}

export async function countUsersService() {
    return countUsers();
}

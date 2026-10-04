import { User } from "./user.model.js";

export async function findAllUsers({ page = 1, limit = 20, search = "" } = {}) {
    const query = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find(query)
            .select("-passwordHash -refreshTokenHash -emailVerificationTokenHash -passwordResetTokenHash")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        User.countDocuments(query),
    ]);

    return { users, total, page, limit };
}

export async function findUserById(id) {
    return User.findById(id)
        .select("-passwordHash -refreshTokenHash -emailVerificationTokenHash -passwordResetTokenHash")
        .lean();
}

export async function updateUserById(id, data) {
    return User.findByIdAndUpdate(id, { $set: data }, { new: true })
        .select("-passwordHash -refreshTokenHash -emailVerificationTokenHash -passwordResetTokenHash")
        .lean();
}

export async function countUsers() {
    return User.countDocuments({ role: "USER" });
}

import { User } from "../users/user.model.js";

export async function createUser(data) {
    return User.create(data);
}

export async function findByEmail(email, includePassword = false) {
    const query = User.findOne({ email });

    if (includePassword) {
        query.select("+passwordHash");
    }

    return query;
}

export async function findById(userId) {
    return User.findById(userId);
}

export async function findByIdWithSensitiveFields(userId) {
    return User.findById(userId).select(
        "+passwordHash +refreshTokenHash"
    );
}

export async function updateById(userId, data) {
    return User.findByIdAndUpdate(
        userId,
        data,
        {
            new: true,
            runValidators: true
        }
    );
}

export async function saveUser(user) {
    return user.save();
}
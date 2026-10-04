import {
    getAllUsersService,
    getUserByIdService,
    updateUserService,
} from "./users.service.js";

export async function getAllUsersController(req, res) {
    const { page = 1, limit = 20, search = "" } = req.query;

    const result = await getAllUsersService({
        page: Number(page),
        limit: Number(limit),
        search,
    });

    res.status(200).json({
        success: true,
        data: result,
    });
}

export async function getUserByIdController(req, res) {
    const user = await getUserByIdService(req.params.id);

    res.status(200).json({
        success: true,
        data: user,
    });
}

export async function updateUserController(req, res) {
    const user = await updateUserService(req.params.id, req.body);

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
    });
}

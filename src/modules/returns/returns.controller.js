import {
    requestReturn,
    getMyReturns,
    getReturnById,
    getReturnByNumber,
    getAllReturns,
    updateReturnStatus
} from "./returns.service.js";

export async function requestReturnController(req, res) {
    const returnDocument = await requestReturn(
        req.user.id,
        req.body
    );

    res.status(201).json({
        success: true,
        message: "Return request submitted successfully",
        data: returnDocument
    });
}

export async function getMyReturnsController(req, res) {
    const returns = await getMyReturns(req.user.id);

    res.status(200).json({
        success: true,
        data: returns
    });
}

export async function getReturnByIdController(req, res) {
    const returnDocument = await getReturnById(
        req.params.returnId,
        req.user.id,
        req.user.role
    );

    res.status(200).json({
        success: true,
        data: returnDocument
    });
}

export async function getReturnByNumberController(req, res) {
    const returnDocument = await getReturnByNumber(
        req.params.returnNumber,
        req.user.id,
        req.user.role
    );

    res.status(200).json({
        success: true,
        data: returnDocument
    });
}

export async function getAllReturnsController(req, res) {
    const returns = await getAllReturns();

    res.status(200).json({
        success: true,
        data: returns
    });
}

export async function updateReturnStatusController(req, res) {
    const returnDocument = await updateReturnStatus(
        req.params.returnId,
        req.user.id,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Return status updated successfully",
        data: returnDocument
    });
}
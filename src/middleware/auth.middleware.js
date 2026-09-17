import {
    verifyAccessToken
} from "../modules/auth/auth.tokens.js";

import { ApiError } from "../utils/ApiError.js";

export function authenticate(
    req,
    res,
    next
) {
    try {
        const authorization =
            req.headers.authorization;

        if (!authorization) {
            throw new ApiError(
                401,
                "Authentication required"
            );
        }

        const [type, token] =
            authorization.split(" ");

        if (
            type !== "Bearer" ||
            !token
        ) {
            throw new ApiError(
                401,
                "Invalid authorization header"
            );
        }

        const payload =
            verifyAccessToken(token);

        req.user = {
            id: payload.userId,
            role: payload.role
        };

        next();
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }

        return next(
            new ApiError(
                401,
                "Invalid or expired access token"
            )
        );
    }
}
import { ApiError } from "../utils/ApiError.js";

export function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return next(
                new ApiError(
                    400,
                    "Validation failed",
                    result.error.issues.map(
                        (issue) => ({
                            field: issue.path.join("."),
                            message: issue.message
                        })
                    )
                )
            );
        }

        req.body = result.data;

        next();
    };
}


export function validateParams(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(
            req.params
        );

        if (!result.success) {
            return next(
                new ApiError(
                    400,
                    "Validation failed",
                    result.error.issues.map(
                        (issue) => ({
                            field: issue.path.join("."),
                            message: issue.message
                        })
                    )
                )
            );
        }

        req.params = result.data;

        next();
    };
}
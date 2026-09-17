export function errorMiddleware(
    error,
    req,
    res,
    next
) {
    console.error(error);

    const statusCode =
        error.statusCode || 500;

    res.status(statusCode).json({
        success: false,

        message:
            error.isOperational
                ? error.message
                : "Internal server error",

        ...(error.details && {
            details: error.details
        })
    });
}
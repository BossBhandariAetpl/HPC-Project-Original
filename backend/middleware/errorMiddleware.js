// Catches requests to routes that don't exist
const notFound = (req, res, next) => {
    // If a user requests a URL that doesn't match any route, this function is triggered
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404); // Send 404 error
    next(error);     // Pass error to next middleware
};

// Handles all other kinds of errors and sends a proper error response
const errorHandler = (err, req, res, next) => {
    // Catch any error passed from route handlers or the notFound function
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    let message = err.message || 'Internal Server Error';

    // Handle invalid MongoDB ObjectId errors
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        message = 'Resource not found';
    }

    // Send JSON response with error details
    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { notFound, errorHandler };

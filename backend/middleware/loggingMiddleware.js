import fs from 'fs/promises'; // Use promise-based fs module

// Returns a middleware
function loggingMiddleware(filename) {
    return async (req, res, next) => {
        try {
            // Create log entry: current timestamp, client's IP, method, and requested URL
            const logData = `${new Date().toISOString()}: ${req.ip} ${req.method} ${req.originalUrl}\n`;

            // Append log entry to file
            await fs.appendFile(filename, logData);

            next(); // Continue to next middleware/route
        } catch (error) {
            console.error("Error writing to log:", error);
            next(); // Still call next to not block request processing
        }
    };
}

export default loggingMiddleware;

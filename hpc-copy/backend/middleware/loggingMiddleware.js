import fs from 'fs'; // Import the fs module

// Returns a middleware
function loggingMiddleware(filename) {
    return async (req, res, next) => {
        try {
            //  current timestamp, clients IP address, HTTP method and requested URL
            const logData = `${new Date().toISOString()}: ${req.ip} ${req.method} ${req.originalUrl}\n`;
            await fs.appendFile(filename, logData, () => {}); // writes that log into a file
            next();
        } catch (error) {
            console.error("Error writing to log:", error);
            next();
        }
    };
}

export default loggingMiddleware;

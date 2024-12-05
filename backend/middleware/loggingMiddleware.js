import fs from 'fs'; // Import the fs module

function loggingMiddleware(filename) {
    return async (req, res, next) => {
        try {
            const logData = `${new Date().toISOString()}: ${req.ip} ${req.method} ${req.originalUrl}\n`;
            await fs.appendFile(filename, logData, () => {}); 
            next();
        } catch (error) {
            console.error("Error writing to log:", error);
            next();
        }
    };
}

export default loggingMiddleware;

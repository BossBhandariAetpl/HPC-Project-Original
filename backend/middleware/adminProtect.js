import asyncHandler from "express-async-handler";

export const adminProtect = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, continue to next middleware
    } else {
        res.status(403).json({ message: 'You need to be admin to access this resource' });
    }
});

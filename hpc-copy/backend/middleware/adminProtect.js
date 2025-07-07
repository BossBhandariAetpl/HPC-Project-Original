import asyncHandler from "express-async-handler";

export const adminProtect = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('You need to be admin to access this resource');
    }
});
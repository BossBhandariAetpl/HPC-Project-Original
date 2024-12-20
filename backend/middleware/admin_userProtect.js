import asyncHandler from "express-async-handler";

export const admin_userProtect = asyncHandler(async (req, res, next) => {

    if (req.user && (req.user.role === 'admin' || req.user.role === 'user')) {
        next();
    } else {
        res.status(403);
        throw new Error('You need to be admin to access this resource');
    }
});
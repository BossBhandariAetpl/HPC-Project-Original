import asyncHandler from "express-async-handler";

export const admin_userProtect = asyncHandler(async (req, res, next) => {         // async function to handle the request and response of the user or the admin      
    if (req.user && (req.user.role === 'admin' || req.user.role === 'user')) {    // 
        next();                                                                   // moves on to the next function 
    } else {
        res.status(403);                                                          // reponds with 403 error
        throw new Error('You need to be admin to access this resource');          // 
    }
});
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserLogin from "../models/userLoginModel.js";

const protect = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.jwt;  // ✅ Safe optional chaining

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // 🔐 Verify JWT

            // 🔍 Find user and exclude password
            req.user = await UserLogin.findById(decoded.userId).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' }); // Safety check
            }

            next(); // ✅ Authenticated, continue
        } catch (error) {
            console.error("JWT verification failed:", error.message);
            res.status(401).json({ message: 'Invalid token' }); // 🚫 Unauthorized
        }
    } else {
        res.status(401).json({ message: 'Not Authorised, no token' }); // 🚫 No token
    }
});

export { protect };

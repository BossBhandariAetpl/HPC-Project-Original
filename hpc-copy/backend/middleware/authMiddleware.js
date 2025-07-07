import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserLogin from "../models/userLoginModel.js";

const protect = asyncHandler(async(req, res, next) => {
    let token = req.cookies.jwt;                           //reads the token
  
    if (token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);               //token verification 
            req.user = await UserLogin.findById(decoded.userId).select('-password'); // finds the user but excludes the password of the user
            next();                                                                  // Moves on to the next function 
        } catch (error) {
            res.status(401);                                                         // unauthorized reponse
            throw new Error('Invalid token')
        }
    } else {
        res.status(401)
        throw new Error('Not Authorised, no token')
    }
})

export { protect };
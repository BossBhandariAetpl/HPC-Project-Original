import express from "express";
import { authUser, logoutUser, getUserProfile, getAllUsers, addUser, getUserByUID, updateUserByUID, deleteUserByUID, matchCurrentUserPassword ,updateUserPassword,} from "../controllers/userController.js";
import trimRequestBody from "../middleware/trimRequestBody.js"
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminProtect.js";
import { admin_userProtect } from "../middleware/admin_userProtect.js";

const userRouter = express.Router();

//Authorize user
userRouter.post("/auth", trimRequestBody, authUser);

//Match User Password
userRouter.post("/match-password", trimRequestBody, protect, matchCurrentUserPassword);


//Register User route
userRouter.post("/logout", logoutUser);

//Get All Users
userRouter.get('/', protect, adminProtect, getAllUsers) 


//Get User Profile
userRouter.route('/profile').get(protect, getUserProfile);

//Add User
// userRouter.post('/add-user',  trimRequestBody, addUser)
userRouter.post('/add-user', protect, adminProtect, trimRequestBody, addUser)

//update password of user

userRouter.route('/:uId/password').patch(protect, adminProtect,updateUserPassword )
// Get DiskUsage




//get, update and delete user by id
userRouter.route('/:uId').get(protect, admin_userProtect, getUserByUID).patch(protect, adminProtect, updateUserByUID).delete(protect, adminProtect, deleteUserByUID);









export default userRouter;
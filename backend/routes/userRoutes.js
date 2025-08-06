import express from "express";
import {
  authUser,
  logoutUser,
  getUserProfile,
  getAllUsers,
  addUser,
  getUserByUID,
  updateUserByUID,
  deleteUserByUID,
  matchCurrentUserPassword,
  updateUserPassword,
} from "../controllers/userController.js";

import trimRequestBody from "../middleware/trimRequestBody.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminProtect.js";
import { admin_userProtect } from "../middleware/admin_userProtect.js";

const userRouter = express.Router();

// 1️⃣ Authorize User (Login)
userRouter.post("/auth", trimRequestBody, authUser);

// 2️⃣ Match current user password
userRouter.post("/match-password", trimRequestBody, protect, matchCurrentUserPassword);

// 3️⃣ Logout user
userRouter.post("/logout", logoutUser);

// 4️⃣ Get all users (Admin only)
userRouter.get('/', protect, adminProtect, getAllUsers);

// 5️⃣ Get logged-in user's profile
userRouter.route('/profile').get(protect, getUserProfile);

// 6️⃣ Add a new user (Admin only)
userRouter.post('/add-user', protect, adminProtect, trimRequestBody, addUser);

// 7️⃣ Update user password by uId (Admin only)
userRouter.route('/:uId/password').patch(protect, adminProtect, updateUserPassword);

// 8️⃣ Get, Update, Delete user by uId
userRouter.route('/:uId')
  .get(protect, admin_userProtect, getUserByUID)
  .patch(protect, adminProtect, updateUserByUID)
  .delete(protect, adminProtect, deleteUserByUID);

export default userRouter;

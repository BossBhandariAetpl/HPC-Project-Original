import express from "express";
import {
  createFile,
  deleteFile,
  fetchDirectories,
  fetchFileContent,
  updateFileContent
} from "../controllers/fileManagementController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin_userProtect } from "../middleware/admin_userProtect.js";

const fileManagementRouter = express.Router();

// Fetch all directories for a user
fileManagementRouter.get(
  '/fetchdirectories/:user',
  protect,
  admin_userProtect,
  fetchDirectories
);

// Fetch and read content of a specific file
fileManagementRouter.get(
  '/filecontent/:user/:filename',
  protect,
  admin_userProtect,
  fetchFileContent
);

// Update content of a specific file
fileManagementRouter.put(
  '/updatefilecontent/:user/:filename',
  protect,
  admin_userProtect,
  updateFileContent
);

// Delete a specific file
fileManagementRouter.delete(
  '/deletefile/:user/:filename',
  protect,
  admin_userProtect,
  deleteFile
);

// Create a new file for a user
fileManagementRouter.post(
  '/createfile/:user',
  protect,
  admin_userProtect,
  createFile
);

export default fileManagementRouter;

import express from "express"
import { createFile, deleteFile, fetchDirectories, fetchFileContent, updateFileContent } from "../controllers/fileManagementController.js";
import { protect } from "../middleware/authMiddleware.js"
import { admin_userProtect } from "../middleware/admin_userProtect.js";


const fileManagementRouter = express.Router();

// Fetch Directory
fileManagementRouter.get('/fetchdirectories/:user', protect, admin_userProtect, fetchDirectories)

// fetch and reads the File content
fileManagementRouter.get('/filecontent/:user/:filename', protect, admin_userProtect, fetchFileContent)


// update File content 
fileManagementRouter.put('/updatefilecontent/:user/:filename',protect, admin_userProtect, updateFileContent)

// Delete A file 
fileManagementRouter.delete('/deletefile/:user/:filename',protect, admin_userProtect, deleteFile)

// Create a File
fileManagementRouter.post('/createfile/:user',protect, admin_userProtect, createFile)

export default fileManagementRouter;
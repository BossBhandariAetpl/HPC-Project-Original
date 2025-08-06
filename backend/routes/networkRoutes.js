import express from "express";
import {
  getDiskUsage,
  getCPUUsage,
  getNetworkInfo,
  addNetworkInfo,
  removeNetworkInfo,
  getNetworkByName
} from "../controllers/networkController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminProtect.js";

const networkRouter = express.Router();

// Get Disk Usage
networkRouter.get('/getdiskusage', protect, adminProtect, getDiskUsage);

// Get CPU Usage
networkRouter.get('/getcpuusage', protect, adminProtect, getCPUUsage);

// Get Network Info
networkRouter.get('/getnetworkinfo', protect, adminProtect, getNetworkInfo);

// Add Network Info
networkRouter.post('/addnetworkinfo', protect, adminProtect, addNetworkInfo);

// Remove Network Info
networkRouter.delete('/removenetworkinfo/:name', protect, adminProtect, removeNetworkInfo);

// Get Network by Name
networkRouter.get('/:name', protect, adminProtect, getNetworkByName);

export default networkRouter;

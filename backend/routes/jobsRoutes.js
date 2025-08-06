import express from "express";
import {
  getAllJobs,
  executeJob // ADD this
} from "../controllers/jobsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminProtect.js";

const jobRouter = express.Router();

// Get All Jobs
jobRouter.get('/getAlljobs', protect, adminProtect, getAllJobs);

// Job Executing Route
jobRouter.post('/execute', executeJob);

export default jobRouter;

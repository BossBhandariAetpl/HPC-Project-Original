import express from "express";
import {
  getNodesInfo,
  getJobsInfo,
  killJob
} from "../controllers/jobSchedulerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminProtect.js";

const jobSchedulerRouter = express.Router();

// Get info of all compute nodes
jobSchedulerRouter.get(
  '/getnodesinfo',
  protect,
  adminProtect,
  getNodesInfo
);

// Get info of all jobs
jobSchedulerRouter.get(
  '/getjobsinfo',
  protect,
  adminProtect,
  getJobsInfo
);

// Kill a job by Job ID
jobSchedulerRouter.delete(
  '/killjob/:jobId',
  protect,
  adminProtect,
  killJob
);

export default jobSchedulerRouter;

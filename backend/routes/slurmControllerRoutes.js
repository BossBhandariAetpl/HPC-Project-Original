import express from "express";
import {
  getSlurmStatus,
  postActions,
  getNodeStatus,
  getJobQueue,
  cancelJob,
  submitJob
} from "../controllers/slurmController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminProtect.js";

const slurmControllerRouter = express.Router();

// Middleware to protect all SLURM routes
slurmControllerRouter.use(protect);
slurmControllerRouter.use(adminProtect);

// 1️⃣ Check Slurmctld status
slurmControllerRouter.get('/getstatus', getSlurmStatus);

// 2️⃣ Start, Stop, Restart slurmctld
slurmControllerRouter.post('/postaction/:action', postActions);

// 3️⃣ Get node status (sinfo)
slurmControllerRouter.get('/nodes', getNodeStatus);

// 4️⃣ Get job queue (squeue)
slurmControllerRouter.get('/jobs', getJobQueue);

// 5️⃣ Cancel a job (scancel)
slurmControllerRouter.post('/canceljob', cancelJob);

// 6️⃣ Submit a job script (sbatch)
slurmControllerRouter.post('/submitjob', submitJob);

export default slurmControllerRouter;

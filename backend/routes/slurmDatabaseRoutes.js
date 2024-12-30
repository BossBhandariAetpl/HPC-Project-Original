import express from "express";
import { getSlurmStatus, postActions } from "../controllers/slurmDatabaseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminProtect.js";

const slurmDatabaseRouter = express.Router();


// Get Slurm Status
slurmDatabaseRouter.get('/getstatus', protect, adminProtect, getSlurmStatus) 

// Pot action on slurm
slurmDatabaseRouter.post('/postaction/:action', protect, adminProtect, postActions) 

export default slurmDatabaseRouter;
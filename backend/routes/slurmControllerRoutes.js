import express from "express";
import { getSlurmStatus, postActions } from "../controllers/slurmController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminProtect.js";

const slurmControllerRouter = express.Router();




// Get Slurm Status
slurmControllerRouter.get('/getstatus', protect, adminProtect, getSlurmStatus) 

// Pot action on slurm
slurmControllerRouter.post('/postaction/:action', protect, adminProtect, postActions) 

export default slurmControllerRouter;
import express from "express"
import { getAllJobs } from "../controllers/jobsController.js"
import { protect } from "../middleware/authMiddleware.js"
import { adminProtect } from "../middleware/adminProtect.js"


const jobRouter = express.Router()

// Get Disk Usage
jobRouter.get('/getAlljobs', protect, adminProtect, getAllJobs) 

export default jobRouter;
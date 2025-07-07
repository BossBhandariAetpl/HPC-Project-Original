import express from "express"
import { getNodesInfo , getJobsInfo, killJob} from "../controllers/jobSchedulerController.js"
import { protect } from "../middleware/authMiddleware.js"
import { adminProtect } from "../middleware/adminProtect.js"


const jobSchedulerRouter = express.Router();


// Get Info of all compute Nodes
jobSchedulerRouter.get('/getnodesinfo',protect, adminProtect, getNodesInfo)

// Get Info of All Jobs
jobSchedulerRouter.get('/getjobsinfo',protect ,adminProtect, getJobsInfo)

// Kill the Job
jobSchedulerRouter.delete('/killjob/:jobId', protect, adminProtect, killJob )

export default jobSchedulerRouter;
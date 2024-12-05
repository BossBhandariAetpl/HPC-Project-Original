import express from "express"
import { getNodesInfo , getJobsInfo} from "../controllers/jobSchedulerController.js"
import { protect } from "../middleware/authMiddleware.js"
import { adminProtect } from "../middleware/adminProtect.js"


const jobSchedulerRouter = express.Router();


// Get Info of all compute Nodes

jobSchedulerRouter.get('/getnodesinfo', getNodesInfo)
jobSchedulerRouter.get('/getjobsinfo', getJobsInfo)

export default jobSchedulerRouter;
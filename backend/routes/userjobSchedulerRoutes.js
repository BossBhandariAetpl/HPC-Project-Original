import express from "express"
import { getUserJobsInfo } from "../controllers/userjobSchedulerController.js";
import { protect } from "../middleware/authMiddleware.js"
import { admin_userProtect } from "../middleware/admin_userProtect.js";


const userjobSchedulerRouter = express.Router();


// Get Info of all compute Nodes

userjobSchedulerRouter.get('/:user/getuserjobsinfo',protect ,admin_userProtect, getUserJobsInfo)

export default userjobSchedulerRouter;
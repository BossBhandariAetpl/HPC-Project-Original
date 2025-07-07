import express from "express";
import { getcomputenodeagentStatus,  postActions } from "../controllers/computenodeagentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminProtect.js";

// Get Slurm Status
const computenodeagentRouter = express.Router();

// gets the status of a specific compute node with protect(checks if the user has logged in) middleware adminProtect 
// (checks if the user is an admin) middleware and calls the getcomputenodeagentStatus controller function 
computenodeagentRouter.get('/getcomputenodeagentStatus/:node', protect, adminProtect, getcomputenodeagentStatus) 


// post/ sends a specific action to a compute node both protected by protect and adminProtect
// calls the postActions controller function
computenodeagentRouter.post('/postaction/:node/:action', protect, adminProtect, postActions) 

export default computenodeagentRouter;
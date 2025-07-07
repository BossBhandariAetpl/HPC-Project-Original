import express from "express";
import { getAllNodes} from "../controllers/nodeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminProtect.js";

const nodeRouter = express.Router();

// Compute Node Management Routes
nodeRouter.get('/getallnodes', protect, adminProtect, getAllNodes) 



export default nodeRouter;
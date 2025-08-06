import express from "express";
import { getcomputenodeagentStatus, postActions } from "../controllers/computenodeagentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminProtect.js";

// Router initialization
const computenodeagentRouter = express.Router();

// GET: Status of a specific compute node
// Middleware: protect (authentication), adminProtect (admin authorization)
computenodeagentRouter.get(
  '/getcomputenodeagentStatus/:node',
  protect,
  adminProtect,
  getcomputenodeagentStatus
);

// POST: Send start/stop/restart to a compute node
// Middleware: protect (authentication), adminProtect (admin authorization)
computenodeagentRouter.post(
  '/postaction/:node/:action',
  protect,
  adminProtect,
  postActions
);

export default computenodeagentRouter;

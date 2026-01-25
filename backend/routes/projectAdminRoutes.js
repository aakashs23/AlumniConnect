import express from "express";
import {
  getPendingProjects,
  approveProject,
  rejectProject
} from "../controllers/projectAdminController.js";
import protect from "../middleware/auth.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

// GET pending proposals for approval
router.get("/pending", protect, adminOnly, getPendingProjects);

// APPROVE proposal (sets valuation, equity, opens funding)
router.patch("/:id/approve", protect, adminOnly, approveProject);

// REJECT proposal (sends reason & locks project)
router.patch("/:id/reject", protect, adminOnly, rejectProject);

router.get("/projects", protect, adminOnly, getAdminProjects);


export default router;

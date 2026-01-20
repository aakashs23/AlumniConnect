import express from "express";
import protect from "../middleware/auth.js";
import {
  createProject,
  getMyProjects,
  getMarketplaceProjects,
  getCompletedProjects
} from "../controllers/projectController.js";
import { investInProject } from "../controllers/projectController.js";
import { getPortfolio } from "../controllers/projectController.js";

const router = express.Router();

// STUDENT: submit project proposal
router.post("/create", protect, createProject);
router.post("/:id/invest", protect, investInProject);
router.get("/mine", protect, getMyProjects);
router.get("/marketplace", protect, getMarketplaceProjects);
router.get("/completed", protect, getCompletedProjects);
router.get("/portfolio", protect, getPortfolio);

export default router;


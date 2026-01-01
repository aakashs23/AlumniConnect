import express from "express";
import Project from "../models/project.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Student creates a project
router.post("/create", protect, async (req, res) => {
  try {
    const { title, problem, solution, fundsRequired } = req.body;

    const project = await Project.create({
      title,
      problem,
      solution,
      fundsRequired,
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to create project", error: error.message });
  }
});

// Anyone can view all projects
router.get("/all", async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "createdBy",
      "name email role"
    );
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects", error: error.message });
  }
});

export default router;
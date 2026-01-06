import express from "express";
import protect from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * TOGGLE INVESTOR MODE (STUDENT ONLY)
 */
router.patch("/toggle-investor", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can toggle investor mode" });
    }

    req.user.canInvest = !req.user.canInvest;
    await req.user.save();

    res.json({
      message: req.user.canInvest
        ? "Investor mode activated"
        : "Investor mode deactivated",
      canInvest: req.user.canInvest,
    });
  } catch (error) {
    console.error("TOGGLE ERROR:", error.message);
    res.status(500).json({ message: "Failed to toggle investor mode" });
  }
});


export default router;

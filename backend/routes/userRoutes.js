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

    const user = await User.findById(req.user._id);

    user.canInvest = !user.canInvest;
    await user.save();

    res.json({
      message: user.canInvest
        ? "Investor mode activated"
        : "Investor mode deactivated",
      canInvest: user.canInvest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to toggle investor mode",
      error: error.message,
    });
  }
});

export default router;

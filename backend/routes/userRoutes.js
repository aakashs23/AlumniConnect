import express from "express";
import protect from "../middleware/auth.js";

const router = express.Router();

/**
 * Toggle investor mode (STUDENT ONLY)
 */
router.patch("/toggle-investor", protect, async (req, res, next) => {
  try {
    // req.user is already attached by protect middleware
    console.log("🔄 Toggle request from:", req.user.name, "| Current canInvest:", req.user.canInvest);
    
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can toggle investor mode" });
    }

    req.user.canInvest = !req.user.canInvest;
    await req.user.save();

    console.log("✅ Toggle successful:", req.user.name, "| New canInvest:", req.user.canInvest);

    return res.status(200).json({
      message: "Investor mode toggled successfully",
      canInvest: req.user.canInvest,
    });
  } catch (error) {
    console.error("❌ TOGGLE ERROR:", error.message);
    return res.status(500).json({
      message: "Failed to toggle investor mode",
      error: error.message
    });
  }
});

export default router;
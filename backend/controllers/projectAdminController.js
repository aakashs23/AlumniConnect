import Project from "../models/project.js";

// =============================================
// ADMIN: Fetch all pending projects
// =============================================
export const getPendingProjects = async (req, res) => {
  try {
    const pending = await Project.find({ status: "pending-approval" })
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(pending);
  } catch (error) {
    console.error("GET PENDING PROJECTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch pending projects" });
  }
};

// =============================================
// ADMIN: Approve project & set valuation + equity
// Opens funding
// =============================================
export const approveProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { valuationApproved, equityForSaleApproved } = req.body;

    if (valuationApproved == null || equityForSaleApproved == null) {
      return res.status(400).json({
        message: "Missing approved valuation or approved equity"
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Save approved fields
    project.valuationApproved = valuationApproved;
    project.equityForSaleApproved = equityForSaleApproved;

    // Funding target = valuation × (equity% / 100)
    project.totalRaise = Math.round(
      valuationApproved * (equityForSaleApproved / 100)
    );

    project.status = "open-for-funding";

    await project.save();

    res.status(200).json({
      message: "Project approved — funding opened",
      projectId: project._id,
      totalRaise: project.totalRaise
    });
  } catch (error) {
    console.error("APPROVE PROJECT ERROR:", error);
    res.status(500).json({ message: "Failed to approve project" });
  }
};

// =============================================
// ADMIN: Reject project with reason
// =============================================
export const rejectProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { reason } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.status = "rejected";
    project.rejectionReason = reason || "No reason provided";
    await project.save();

    res.status(200).json({ message: "Project rejected" });
  } catch (error) {
    console.error("REJECT PROJECT ERROR:", error);
    res.status(500).json({ message: "Failed to reject project" });
  }
};

export const getAdminProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      status: { $in: ["pending-approval", "open-for-funding", "funded"] }
    })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to load admin projects" });
  }
};

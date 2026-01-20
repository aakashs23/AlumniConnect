import Project from "../models/project.js";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      problem,
      solution,
      valuationProposal,
      equityForSaleProposal,
    } = req.body;

    const project = await Project.create({
      title,
      problem,
      solution,
      valuationProposal,
      equityForSaleProposal,
      createdBy: req.user._id,
      status: "pending-approval",
      fundsRaised: 0
    });

    res.status(201).json({ message: "Project submitted for approval", project });
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to load projects" });
  }
};

export const getMarketplaceProjects = async (req, res) => {
  try {
    const user = req.user;

    // ADMIN sees all open projects
    if (user.role === "admin") {
      const all = await Project.find({
        status: { $in: ["open-for-funding"] }
      })
        .populate("createdBy", "name")
        .sort({ createdAt: -1 });

      return res.json(all);
    }

    // ALUMNI + STUDENT-INVESTOR
    if (user.role === "alumni" || user.canInvest) {
      const investables = await Project.find({
        status: { $in: ["open-for-funding"] }
      })
        .populate("createdBy", "name")
        .sort({ createdAt: -1 });

      return res.json(investables);
    }

    // Default student cannot view marketplace
    return res.status(403).json({ message: "Enable investor mode to view marketplace" });
  } catch (err) {
    res.status(500).json({ message: "Failed to load marketplace" });
  }
};

export const getCompletedProjects = async (req, res) => {
  try {
    const completed = await Project.find({
      status: "funded"
    })
      .populate("createdBy", "name")
      .sort({ updatedAt: -1 });

    return res.json(completed);
  } catch (err) {
    res.status(500).json({ message: "Failed to load completed projects" });
  }
};

export const investInProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user._id;
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid investment amount" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // B.1 prevent self-investing
    if (String(project.createdBy) === String(userId)) {
      return res.status(400).json({ message: "You cannot invest in your own project" });
    }

    if (project.status !== "open-for-funding") {
      return res.status(400).json({ message: "Project not open for funding" });
    }

    // apply funds
    project.fundsRaised += Number(amount);

    // B.5 equity allocation
    let allocatedEquity = null;
    if (project.totalRaise && project.equityForSaleApproved) {
      allocatedEquity =
        (Number(amount) / project.totalRaise) * project.equityForSaleApproved;
    }

    // record investment in cap-table
    project.investors.push({
      investor: userId,
      amount: Number(amount),
      equity: allocatedEquity
    });

    // B.4 funding completion
    if (project.totalRaise && project.fundsRaised >= project.totalRaise) {
      project.status = "funded";
    }

    await project.save();

    return res.json({ message: "Investment successful", project });
  } catch (err) {
    console.error("INVEST ERROR:", err);
    res.status(500).json({ message: "Failed to invest" });
  }
};
export const getPortfolio = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({
      "investors.investor": userId
    })
      .populate("createdBy", "name")
      .populate("investors.investor", "name")
      .sort({ updatedAt: -1 });

    return res.json(projects);
  } catch (err) {
    console.error("GET PORTFOLIO ERROR:", err);
    res.status(500).json({ message: "Failed to load portfolio" });
  }
};

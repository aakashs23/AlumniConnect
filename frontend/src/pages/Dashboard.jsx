import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  // ================================
  // FETCH PROJECTS BASED ON ROLE
  // ================================
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects/all");

        let visibleProjects = [];

        // Student without investor mode → only own projects
        if (user.role === "student" && !user.canInvest) {
          visibleProjects = res.data.filter(
            (project) => project.createdBy?._id === user._id
          );
        } else {
          // Admin, Alumni, Student Investor → all projects
          visibleProjects = res.data;
        }

        setProjects(visibleProjects);
      } catch (error) {
        console.error(error);
        alert("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // ================================
  // TOGGLE INVESTOR MODE (STUDENT)
  // ================================
  const toggleInvestorMode = async () => {
    try {
      const res = await API.patch(
        "/users/toggle-investor",
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const updatedUser = {
        ...user,
        canInvest: res.data.canInvest,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to toggle investor mode");
    }
  };

  // ================================
  // INVEST HANDLER
  // ================================
  const handleInvest = async (projectId) => {
    const amount = prompt("Enter amount to invest");

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      await API.post(
        `/projects/invest/${projectId}`,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Investment successful");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Investment failed");
    }
  };

  // ================================
  // UI
  // ================================
  return (
    <div style={{ padding: "40px" }}>
      <h2>Dashboard</h2>

      {/* USER INFO */}
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>

      {/* STUDENT INVESTOR TOGGLE */}
      {user.role === "student" && (
        <div style={{ marginBottom: "20px" }}>
          <button onClick={toggleInvestorMode}>
            {user.canInvest
              ? "Deactivate Investor Mode"
              : "Activate Investor Mode"}
          </button>

          <p style={{ marginTop: "5px", fontSize: "14px" }}>
            Status:{" "}
            <strong>
              {user.canInvest ? "Investor Mode ON" : "Investor Mode OFF"}
            </strong>
          </p>
        </div>
      )}

      <hr />

      {/* PROJECTS SECTION */}
      <h3>
        {user.role === "student" && !user.canInvest
          ? "My Projects"
          : "All Projects"}
      </h3>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects available</p>
      ) : (
        projects.map((project) => (
          <div
            key={project._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <h4>{project.title}</h4>

            <p><strong>Problem:</strong> {project.problem}</p>
            <p><strong>Solution:</strong> {project.solution}</p>
            <p><strong>Funds Required:</strong> ₹{project.fundsRequired}</p>
            <p><strong>Funds Raised:</strong> ₹{project.fundsRaised || 0}</p>

            <p style={{ fontStyle: "italic" }}>
              Created by: {project.createdBy?.name}
            </p>

            {/* INVEST BUTTON */}
            {user.canInvest && user.role !== "admin" && (
              <button onClick={() => handleInvest(project._id)}>
                Invest
              </button>
            )}
          </div>
        ))
      )}

      {/* STUDENT ACTION */}
      {user.role === "student" && (
        <button
          style={{ marginTop: "20px" }}
          onClick={() => (window.location.href = "/create-project")}
        >
          Create New Project
        </button>
      )}
    </div>
  );
}

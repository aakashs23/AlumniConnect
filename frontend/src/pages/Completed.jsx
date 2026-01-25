import { useEffect, useState } from "react";
import API from "../services/api";

export default function Completed() {
  const [projects, setProjects] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/projects/completed");
        setProjects(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load completed projects");
      }
    };
    load();
  }, []);

  // ================================
  // ADMIN — EXIT PROJECT
  // ================================
  const exitProject = async (id) => {
    const multiplier = prompt("Enter return multiplier (e.g. 2.5):");
    if (!multiplier || Number(multiplier) <= 0) return;

    try {
      await API.post(`/projects/${id}/exit`, {
        returnMultiplier: Number(multiplier)
      });

      alert("Project exited successfully");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Exit failed");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Completed Projects</h2>

      {projects.length === 0 && <p>No funded projects yet</p>}

      {projects.map((project) => (
        <div
          key={project._id}
          style={{
            border: "1px solid #ccc",
            padding: 20,
            marginBottom: 15,
            borderRadius: 8
          }}
        >
          <h3>{project.title}</h3>
          <p><strong>Raised:</strong> ₹{project.fundsRaised}</p>

          <p>
            <strong>Status:</strong>{" "}
            {project.isExited ? "Exited ✅" : "Funded 🎉"}
          </p>

          {/* ADMIN ONLY — EXIT BUTTON */}
          {user?.role === "admin" && !project.isExited && (
            <button
              style={{
                marginTop: 10,
                background: "#e74c3c",
                color: "white",
                padding: "6px 12px",
                borderRadius: 4
              }}
              onClick={() => exitProject(project._id)}
            >
              Exit Project
            </button>
          )}

          {/* INFO AFTER EXIT */}
          {project.isExited && (
            <p style={{ marginTop: 8, color: "#2ecc71", fontSize: 14 }}>
              💰 Project exited — investor returns distributed
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

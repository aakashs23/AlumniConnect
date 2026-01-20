import { useEffect, useState } from "react";
import API from "../services/api";

export default function Marketplace() {
  const [projects, setProjects] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/projects/marketplace");
        setProjects(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load marketplace");
      }
    };
    load();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>Marketplace</h2>

      {projects.length === 0 && <p>No active fundraising projects</p>}

      {projects.map((project) => {
        const percent = project.totalRaise
          ? Math.min((project.fundsRaised / project.totalRaise) * 100, 100)
          : 0;

        const canInvest =
          (user.role === "alumni" || user.canInvest) &&
          user._id !== project.createdBy._id &&
          project.status === "open-for-funding";

        return (
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
            <p>{project.problem}</p>

            <p>
              <strong>Target:</strong> ₹{project.totalRaise}
            </p>
            <p>
              <strong>Raised:</strong> ₹{project.fundsRaised}
            </p>

            {/* B.7 Progress Bar */}
            {project.totalRaise && (
              <div style={{ marginTop: 10 }}>
                <small>
                  {percent.toFixed(0)}% funded ({project.fundsRaised} /{" "}
                  {project.totalRaise})
                </small>
                <div
                  style={{
                    background: "#e5e5e5",
                    height: 10,
                    borderRadius: 6,
                    marginTop: 5,
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${percent}%`,
                      background: percent >= 100 ? "#2ecc71" : "#3498db",
                      transition: "width 0.3s"
                    }}
                  />
                </div>
              </div>
            )}

            {/* Invest Button (UI self‑investing gating) */}
            {canInvest && (
              <button
                style={{ marginTop: 15 }}
                onClick={() => alert("Invest flow coming after Module C")}
              >
                Invest
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

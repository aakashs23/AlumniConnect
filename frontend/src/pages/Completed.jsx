import { useEffect, useState } from "react";
import API from "../services/api";
import "./Completed.css";

export default function Completed() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await API.get("/projects/completed");
        setProjects(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load completed projects");
      } finally {
        setIsLoading(false);
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

  const LoadingSkeleton = () => (
    <div className="completed-grid animate-fade-in">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="completed-card skeleton" style={{ height: '240px', border: 'none', background: '#f3f4f6' }}></div>
      ))}
    </div>
  );

  return (
    <div className="completed-container animate-fade-in">
      {/* Header */}
      <header className="completed-header">
        <h2 className="completed-title">Completed Projects</h2>
        <p className="completed-subtitle">Browse successful fundraising campaigns and portfolio exits.</p>
      </header>

      {/* Main Grid Content */}
      <main className="completed-content">
        {isLoading ? (
          <LoadingSkeleton />
        ) : projects.length === 0 ? (
          <div className="empty-completed">
            <p>No funded projects yet in the system.</p>
          </div>
        ) : (
          <div className="completed-grid animate-slide-up delay-100">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="completed-card hover-card-effect"
                style={{ animationDelay: `${index * 0.05}s` }}
              >

                <div className="c-header">
                  <h3 className="c-title">{project.title}</h3>
                  <span className={`c-badge ${project.isExited ? "exited" : "funded"}`}>
                    {project.isExited ? "Exited" : "Funded"}
                  </span>
                </div>

                <div className="c-details">
                  <div className="c-row">
                    <span className="c-label">Total Raised</span>
                    <span className="c-value">₹{project.fundsRaised.toLocaleString()}</span>
                  </div>
                  <div className="c-row">
                    <span className="c-label">Current Status</span>
                    <span className="c-value" style={{ color: project.isExited ? '#166534' : '#1e40af' }}>
                      {project.isExited ? "Post-Exit ✅" : "Operation Active 🎉"}
                    </span>
                  </div>
                </div>

                {/* ADMIN ONLY — EXIT BUTTON */}
                {user?.role === "admin" && !project.isExited && (
                  <button className="btn-exit" onClick={() => exitProject(project._id)}>
                    Trigger Project Exit
                  </button>
                )}

                {/* INFO AFTER EXIT */}
                {project.isExited && (
                  <div className="c-success-msg">
                    <span>💰</span> Returns Distributed
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

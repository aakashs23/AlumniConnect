import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Marketplace.css";

export default function Marketplace() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await API.get("/projects/marketplace");
        setProjects(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load marketplace");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleInvest = async (projectId) => {
    const amount = prompt("Enter investment amount (₹):");

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Invalid amount");
      return;
    }

    try {
      await API.post(
        `/projects/invest/${projectId}`,
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      alert("Investment successful!");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Investment failed");
    }
  };

  const LoadingSkeleton = () => (
    <div className="project-grid animate-fade-in">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="marketplace-card skeleton" style={{ height: '320px', border: 'none', background: '#f3f4f6' }}></div>
      ))}
    </div>
  );

  return (
    <div className="marketplace-container animate-fade-in">
      {/* Header */}
      <header className="marketplace-header">
        <div>
          <h2 className="marketplace-title">Marketplace</h2>
          <p className="marketplace-subtitle">Discover and invest in the next big alumni startups.</p>
        </div>

        {(user.role === "alumni" || user.canInvest) && (
          <button
            className="btn-portfolio hover-card-effect"
            onClick={() => navigate("/portfolio")}
          >
            💼 View Portfolio
          </button>
        )}
      </header>

      {/* Main Content Areas */}
      <main className="marketplace-content">
        {isLoading ? (
          <LoadingSkeleton />
        ) : projects.length === 0 ? (
          <div className="empty-marketplace">
            <p>No active fundraising projects available at the moment.</p>
          </div>
        ) : (
          <div className="project-grid animate-slide-up delay-100">
            {projects.map((project, index) => {
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
                  className="marketplace-card hover-card-effect"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="card-header">
                    <h3 className="card-title">{project.title}</h3>
                    <p className="card-description">{project.problem}</p>
                  </div>

                  <div className="card-metrics">
                    <div className="metric-box">
                      <span className="metric-label">Target Goal</span>
                      <span className="metric-value">₹{project.totalRaise?.toLocaleString() || 0}</span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-label">Raised</span>
                      <span className="metric-value" style={{ color: project.fundsRaised > 0 ? '#10b981' : 'inherit' }}>
                        ₹{project.fundsRaised?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {project.totalRaise && (
                    <div className="progress-container">
                      <div className="progress-stats">
                        <span className="progress-percentage">{percent.toFixed(0)}% Funded</span>
                        <span className="progress-fractions">₹{project.fundsRaised?.toLocaleString() || 0} / ₹{project.totalRaise.toLocaleString()}</span>
                      </div>
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: percent >= 100 ? "#10b981" : "#3b82f6",
                            transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)"
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Invest Button */}
                  {canInvest && (
                    <button className="btn-invest" onClick={() => handleInvest(project._id)}>
                      Invest Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

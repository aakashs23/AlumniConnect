import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // ================================
  // FETCH LISTS
  // ================================
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (user.role === "student") {
        const res = await API.get("/projects/mine", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setProjects(res.data);
      } else if (user.role === "admin") {
        const res = await API.get("/admin/projects/pending", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setPending(res.data);
      }
    } catch (err) {
      console.error(err);
      // alert("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user.role]);

  // ================================
  // STUDENT — INVESTOR MODE TOGGLE
  // ================================
  const toggleInvestorMode = async () => {
    try {
      const res = await API.patch("/users/toggle-investor", {}, { headers: { Authorization: `Bearer ${user.token}` } });
      const updatedUser = { ...user, canInvest: res.data.canInvest };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (res.data.canInvest) {
        window.location.href = "/marketplace";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert("Failed to toggle investor mode");
    }
  };

  // ================================
  // ADMIN APPROVE
  // ================================
  const approve = async (id) => {
    const valuationApproved = prompt("Enter approved valuation (₹):");
    const equityApproved = prompt("Enter approved equity (%):");
    if (!valuationApproved || !equityApproved) return;

    try {
      await API.patch(
        `/admin/projects/${id}/approve`,
        {
          valuationApproved: Number(valuationApproved),
          equityForSaleApproved: Number(equityApproved)
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      alert("Project approved!");
      fetchDashboardData();
    } catch (err) {
      alert("Approval failed");
    }
  };

  // ================================
  // ADMIN REJECT
  // ================================
  const reject = async (id) => {
    const reason = prompt("Reason for rejection:");
    if (!reason) return;

    try {
      await API.patch(
        `/admin/projects/${id}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      alert("Project rejected");
      fetchDashboardData();
    } catch (err) {
      alert("Rejection failed");
    }
  };

  // ─────────────────────────────────────
  // STRUCTURAL COMPONENTS
  // ─────────────────────────────────────

  const LoadingSkeleton = () => (
    <div className="skeleton-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px 0' }}>
      <div className="skeleton" style={{ height: '140px', width: '100%', borderRadius: '12px' }}></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="skeleton" style={{ height: '240px', width: '100%', borderRadius: '12px' }}></div>
        <div className="skeleton" style={{ height: '240px', width: '100%', borderRadius: '12px' }}></div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Top Navigation Bar */}
      <nav className="dashboard-nav glass-nav">
        <div className="dashboard-logo">AlumniConnect</div>
        <div className="nav-user" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="nav-user-info" style={{ marginRight: "10px", textAlign: "right" }}>
            <span className="nav-user-name" style={{ display: "block", fontWeight: 600 }}>{user.name}</span>
            <span className="nav-user-role" style={{ fontSize: "0.8rem", color: "#666", textTransform: "capitalize" }}>{user.role}</span>
          </div>
          <button
            className="btn-icon hover-card-effect"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
            title="Sign Out"
            style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "8px", background: "#fff", cursor: "pointer" }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Action Bar (Below Nav) */}
      <div className="action-bar animate-slide-up" style={{ padding: "20px 40px", borderBottom: "1px solid #eee", background: "#f9fafb" }}>
        <div className="action-buttons" style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {(user.role === "alumni" || user.canInvest) && (
            <button className="btn-dashboard hover-card-effect" onClick={() => window.location.href = "/portfolio"} style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}>
              💼 View Portfolio
            </button>
          )}

          {user.role === "alumni" && (
            <button className="btn-dashboard hover-card-effect" onClick={() => window.location.href = "/marketplace"} style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}>
              🛍️ Marketplace
            </button>
          )}

          {user.role === "student" && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "8px" }}>
              <button
                className="btn-dashboard hover-card-effect"
                onClick={toggleInvestorMode}
                style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #ccc", background: user.canInvest ? "#fef3c7" : "#fff", cursor: "pointer" }}
              >
                {user.canInvest ? "⚠️ Deactivate Investor Mode" : "⚡ Activate Investor Mode"}
              </button>
              <span className={`status-badge ${user.canInvest ? 'status-active' : 'status-inactive'}`} style={{ fontSize: "0.85rem", padding: "6px 12px", borderRadius: "20px", background: user.canInvest ? "#dcfce7" : "#f1f5f9" }}>
                {user.canInvest ? "Mode: ON" : "Mode: OFF"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Areas */}
      <main className="dashboard-content" style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* ================================
              ADMIN — PENDING PROJECTS
            ================================ */}
            {user.role === "admin" && (
              <section className="animate-slide-up delay-100">
                <div className="section-header" style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "1.5rem", margin: 0 }}>Pending Approvals</h3>
                </div>

                {pending.length === 0 ? (
                  <div className="empty-state" style={{ padding: "40px", textAlign: "center", border: "1px dashed #ccc", borderRadius: "12px" }}>
                    <div className="empty-icon" style={{ fontSize: "2rem" }}>✅</div>
                    <p className="empty-text">No pending projects to review.</p>
                  </div>
                ) : (
                  <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
                    {pending.map((p) => (
                      <div key={p._id} className="project-card hover-card-effect" style={{ padding: "24px", border: "1px solid #eee", borderRadius: "16px", background: "#fff", display: "flex", flexDirection: "column" }}>
                        <div className="project-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                          <h4 className="project-title" style={{ margin: 0, fontSize: "1.2rem" }}>{p.title}</h4>
                          <span className="project-badge pending" style={{ padding: "4px 10px", background: "#fef3c7", color: "#d97706", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold" }}>Pending</span>
                        </div>

                        <div className="project-creator" style={{ marginBottom: "16px", color: "#666", fontSize: "0.9rem" }}>
                          👤 {p.creator?.name || "Unknown"}
                        </div>

                        <div className="project-details" style={{ display: "flex", flexDirection: "column", gap: "8px", background: "#f9fafb", padding: "16px", borderRadius: "8px", marginBottom: "20px", flexGrow: 1 }}>
                          <div className="detail-item" style={{ display: "flex", justifyContent: "space-between" }}>
                            <span className="detail-label" style={{ color: "#666", fontSize: "0.9rem" }}>Valuation Proposed</span>
                            <span className="detail-value" style={{ fontWeight: 600 }}>₹{p.valuationProposal?.toLocaleString()}</span>
                          </div>
                          <div className="detail-item" style={{ display: "flex", justifyContent: "space-between" }}>
                            <span className="detail-label" style={{ color: "#666", fontSize: "0.9rem" }}>Equity Proposed</span>
                            <span className="detail-value" style={{ fontWeight: 600 }}>{p.equityForSaleProposal}%</span>
                          </div>
                        </div>

                        <div className="project-actions" style={{ display: "flex", gap: "10px" }}>
                          <button style={{ flex: 1, padding: "10px", background: "#10b981", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }} onClick={() => approve(p._id)}>
                            Approve
                          </button>
                          <button style={{ flex: 1, padding: "10px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }} onClick={() => reject(p._id)}>
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ================================
              STUDENT — MY PROJECTS
            ================================ */}
            {user.role === "student" && (
              <section className="animate-slide-up delay-100">
                <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "1.5rem", margin: 0 }}>My Projects</h3>
                  <button onClick={() => window.location.href = "/create"} style={{ padding: "10px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                    + Launch Startup
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className="empty-state" style={{ padding: "60px 20px", textAlign: "center", border: "1px dashed #ccc", borderRadius: "12px" }}>
                    <div className="empty-icon" style={{ fontSize: "2.5rem", marginBottom: "16px" }}>🚀</div>
                    <p className="empty-text" style={{ fontSize: "1.1rem", color: "#666" }}>You haven't launched any projects yet.</p>
                  </div>
                ) : (
                  <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
                    {projects.map((p) => (
                      <div key={p._id} className="project-card hover-card-effect" style={{ padding: "24px", border: "1px solid #eee", borderRadius: "16px", background: "#fff" }}>
                        <div className="project-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                          <h4 className="project-title" style={{ margin: 0, fontSize: "1.2rem" }}>{p.title}</h4>
                          <span style={{
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                            background: p.status === 'approved' ? '#dcfce7' : p.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                            color: p.status === 'approved' ? '#166534' : p.status === 'rejected' ? '#991b1b' : '#d97706',
                            textTransform: 'capitalize'
                          }}>
                            {p.status}
                          </span>
                        </div>

                        <div className="project-details" style={{ display: "flex", flexDirection: "column", gap: "10px", background: "#f9fafb", padding: "16px", borderRadius: "8px" }}>
                          <div className="detail-item" style={{ display: "flex", justifyContent: "space-between" }}>
                            <span className="detail-label" style={{ color: "#666", fontSize: "0.9rem" }}>Valuation</span>
                            <span className="detail-value" style={{ fontWeight: 600 }}>
                              {p.valuationApproved ? `₹${p.valuationApproved.toLocaleString()}` : "Pending"}
                            </span>
                          </div>
                          <div className="detail-item" style={{ display: "flex", justifyContent: "space-between" }}>
                            <span className="detail-label" style={{ color: "#666", fontSize: "0.9rem" }}>Target Raise</span>
                            <span className="detail-value" style={{ fontWeight: 600 }}>
                              {p.totalRaise ? `₹${p.totalRaise.toLocaleString()}` : "Pending"}
                            </span>
                          </div>
                          <div className="detail-item" style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #e5e7eb" }}>
                            <span className="detail-label" style={{ color: "#666", fontWeight: "bold" }}>Funds Raised</span>
                            <span className="detail-value" style={{ fontWeight: "bold", color: p.fundsRaised > 0 ? "#10b981" : "#111827" }}>
                              ₹{p.fundsRaised?.toLocaleString() || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

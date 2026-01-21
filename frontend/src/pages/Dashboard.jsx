import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // ================================
  // FETCH MY PROJECTS (STUDENTS ONLY)
  // ================================
  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const res = await API.get("/projects/mine", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setProjects(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    if (user.role === "student") fetchMyProjects();
  }, []);

  // ================================
  // ADMIN — FETCH PENDING PROJECTS
  // ================================
  useEffect(() => {
    if (user.role !== "admin") return;

    const fetchPending = async () => {
      try {
        const res = await API.get("/admin/projects/pending", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setPending(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPending();
  }, []);

  // ================================
  // STUDENT — INVESTOR MODE TOGGLE
  // ================================
  const toggleInvestorMode = async () => {
    try {
      const res = await API.patch("/users/toggle-investor");
      const updatedUser = { ...user, canInvest: res.data.canInvest };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (res.data.canInvest) {
        navigate("/marketplace");
      } else {
        navigate("/dashboard");
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
      window.location.reload();
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
      window.location.reload();
    } catch (err) {
      alert("Rejection failed");
    }
  };

  // ======================================================
  // UI START
  // ======================================================

  return (
    <div style={{ padding: "40px" }}>
      <h2>Dashboard</h2>
      <p><strong>{user.name}</strong> ({user.role})</p>

      {/* C.5 — Portfolio Button */}
      {(user.role === "alumni" || user.canInvest) && (
        <button
          style={{ marginBottom: "20px", marginRight: "10px" }}
          onClick={() => navigate("/portfolio")}
        >
          View Portfolio
        </button>
      )}

      <hr />

      {/* ================================
        STUDENT — INVESTOR MODE TOGGLE
      ================================ */}
      {user.role === "student" && (
        <div style={{ marginBottom: "20px" }}>
          <button onClick={toggleInvestorMode}>
            {user.canInvest ? "Deactivate Investor Mode" : "Activate Investor Mode"}
          </button>
          <p style={{ marginTop: "5px", fontSize: "14px" }}>
            Status: <strong>{user.canInvest ? "Investor Mode ON" : "Investor Mode OFF"}</strong>
          </p>
        </div>
      )}

      {/* ================================
        ADMIN — PENDING PROJECTS
      ================================ */}
      {user.role === "admin" && (
        <div>
          <h3>Pending Projects for Approval</h3>
          {pending.length === 0 ? (
            <p>No pending projects</p>
          ) : (
            pending.map((p) => (
              <div key={p._id} style={styles.card}>
                <h4>{p.title}</h4>
                <p><strong>Valuation Proposed:</strong> ₹{p.valuationProposal}</p>
                <p><strong>Equity Proposed:</strong> {p.equityForSaleProposal}%</p>
                <p><em>By {p.creator?.name}</em></p>
                <button onClick={() => approve(p._id)}>Approve</button>
                <button style={{ marginLeft: 10 }} onClick={() => reject(p._id)}>Reject</button>
              </div>
            ))
          )}
          <hr />
        </div>
      )}

      {/* ================================
        STUDENT — MY PROJECTS
      ================================ */}
      {user.role === "student" && (
        <>
          <h3>My Projects</h3>

          {loading ? (
            <p>Loading...</p>
          ) : projects.length === 0 ? (
            <p>You have not created any projects yet</p>
          ) : (
            projects.map((p) => (
              <div key={p._id} style={styles.card}>
                <h4>{p.title}</h4>
                <p><strong>Status:</strong> {p.status}</p>
                <p><strong>Valuation:</strong> {p.valuationApproved ? `₹${p.valuationApproved}` : "Pending"}</p>
                <p><strong>Equity:</strong> {p.equityForSaleApproved ? `${p.equityForSaleApproved}%` : "Pending"}</p>
                {p.totalRaise && <p><strong>Target Raise:</strong> ₹{p.totalRaise}</p>}
                <p><strong>Funds Raised:</strong> ₹{p.fundsRaised}</p>
              </div>
            ))
          )}

          <button style={{ marginTop: 20 }} onClick={() => navigate("/create-project")}>
            Create New Project
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "12px",
    borderRadius: "8px"
  }
};

import { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from "recharts";

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/projects/portfolio");
        setProjects(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load portfolio");
      }
    };

    load();
  }, []);

  // ─────────────────────────────────────
  // C.6 — SUMMARY CALCULATIONS
  // ─────────────────────────────────────
  let totalInvested = 0;
  let totalEquity = 0;
  let totalProjects = 0;

  projects.forEach(p => {
    const inv = p.investors.filter(i => i.investor._id === user._id);
    if (inv.length > 0) {
      totalProjects++;
      inv.forEach(i => {
        totalInvested += i.amount;
        totalEquity += i.equity || 0;
      });
    }
  });

  // C.7 CHART DATA
  const chartEquityData = projects
  .map(p => {
    const inv = p.investors.find(i => i.investor._id === user._id);
    if (!inv || !inv.equity) return null;
    return { name: p.title, value: inv.equity };
  })
  .filter(Boolean);

  const chartInvestmentData = projects
  .map(p => {
    const inv = p.investors.find(i => i.investor._id === user._id);
    if (!inv || !inv.amount) return null;
    return { name: p.title, amount: inv.amount };
  })
  .filter(Boolean);

  // COLORS
  const colors = ["#007bff", "#28a745", "#ffc107", "#ff5733", "#6f42c1", "#20c997"];

  {/* C.7 — PIE CHART */}
  {chartEquityData.length > 0 && (
    <div style={{ marginBottom: 40 }}>
      <h3>Equity Distribution</h3>
      <PieChart width={350} height={250}>
        <Pie
          data={chartEquityData}
          cx={150}
          cy={100}
          outerRadius={80}
          dataKey="value"
          label
        >
          {chartEquityData.map((entry, idx) => (
            <Cell key={idx} fill={colors[idx % colors.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </div>
  )}

  {/* C.7 — BAR CHART */}
  {chartInvestmentData.length > 0 && (
    <div style={{ marginBottom: 40 }}>
      <h3>Investment by Project (₹)</h3>
      <BarChart width={400} height={250} data={chartInvestmentData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#4caf50" />
      </BarChart>
    </div>
  )}

  return (
    <div style={{ padding: 30 }}>
      <h2>My Portfolio</h2>

      {/* SUMMARY BOX */}
      {projects.length > 0 && (
        <div style={{
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: 8,
          marginBottom: 20,
          background: "#fafafa"
        }}>
          <h3>Portfolio Summary</h3>
          <p><strong>Total Invested:</strong> ₹{totalInvested.toLocaleString()}</p>
          <p><strong>Total Equity:</strong> {totalEquity.toFixed(2)}%</p>
          <p><strong>Projects Owned:</strong> {totalProjects}</p>
        </div>
      )}

      {projects.length === 0 && (
        <p>You have not invested in any projects yet.</p>
      )}

      {projects.map(p => (
        <div key={p._id}
          style={{
            border: "1px solid #ccc",
            padding: 20,
            marginBottom: 15,
            borderRadius: 8
          }}
        >
          <h3>{p.title}</h3>
          <p><strong>Status:</strong> {p.status}</p>
          <p><strong>Invested In:</strong> {p.createdBy?.name}</p>

          <h4 style={{ marginTop: 10 }}>Your Investments:</h4>
          {p.investors
            .filter(i => i.investor._id === user._id)
            .map(i => (
              <div key={i._id} style={{ marginBottom: 5 }}>
                <p>💸 Amount: ₹{i.amount}</p>
                <p>📊 Equity: {i.equity?.toFixed(2)}%</p>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

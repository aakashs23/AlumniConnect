import { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from "recharts";
import "./Portfolio.css";

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await API.get("/projects/portfolio", {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setProjects(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load portfolio");
      } finally {
        setIsLoading(false);
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

  // ─────────────────────────────────────
  // C.7 — CHART DATA
  // ─────────────────────────────────────
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

  const colors = ["#2563eb", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#14b8a6"];

  const LoadingSkeleton = () => (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '100px' }}></div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {[...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: '320px' }}></div>)}
      </div>
    </div>
  );

  // ─────────────────────────────────────
  // UI
  // ─────────────────────────────────────
  return (
    <div className="portfolio-container animate-fade-in">
      {/* Header */}
      <header className="portfolio-header">
        <h2 className="portfolio-title">My Portfolio</h2>
        <p className="portfolio-subtitle">Track your startup investments and generated ROI over time.</p>
      </header>

      <main className="portfolio-content">
        {isLoading ? (
          <LoadingSkeleton />
        ) : projects.length === 0 ? (
          <div className="empty-portfolio animate-slide-up">
            <p>You have not invested in any projects yet.</p>
          </div>
        ) : (
          <>
            {/* SUMMARY BOX */}
            <div className="summary-grid animate-slide-up">
              <div className="summary-card hover-card-effect">
                <span className="summary-label">Total Capital Invested</span>
                <span className="summary-value">₹{totalInvested.toLocaleString()}</span>
              </div>
              <div className="summary-card hover-card-effect">
                <span className="summary-label">Aggregated Equity</span>
                <span className="summary-value">{totalEquity.toFixed(2)}%</span>
              </div>
              <div className="summary-card hover-card-effect">
                <span className="summary-label">Startups Backed</span>
                <span className="summary-value">{totalProjects}</span>
              </div>
            </div>

            {/* CHARTS */}
            <div className="charts-grid animate-slide-up delay-100">
              {/* C.7 — PIE CHART */}
              {chartEquityData.length > 0 && (
                <div className="chart-card hover-card-effect">
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
                      {chartEquityData.map((_, idx) => (
                        <Cell key={idx} fill={colors[idx % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>
              )}

              {/* C.7 — BAR CHART */}
              {chartInvestmentData.length > 0 && (
                <div className="chart-card hover-card-effect">
                  <h3>Allocation by Project (₹)</h3>
                  <BarChart width={380} height={250} data={chartInvestmentData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                    <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </div>
              )}
            </div>

            {/* PROJECT LIST */}
            <div className="projects-header animate-slide-up delay-200">
              <h3 className="section-title">Investment Positions</h3>
            </div>

            <div className="portfolio-grid animate-slide-up delay-300">
              {projects.map((p, index) => (
                <div
                  key={p._id}
                  className="investment-card hover-card-effect"
                  style={{ animationDelay: `${index * 0.05 + 0.3}s` }}
                >
                  <div className="inv-header">
                    <h3 className="inv-title">{p.title}</h3>
                    <span className={`inv-badge ${p.isExited ? "exited" : "active"}`}>
                      {p.isExited ? "Exited" : "Active"}
                    </span>
                  </div>

                  <div className="inv-founder">
                    👤 Founder: {p.createdBy?.name}
                  </div>

                  <div className="inv-details">
                    <h4>Investment Breakdown</h4>
                    {p.investors
                      .filter(i => i.investor._id === user._id)
                      .map(i => (
                        <div key={i._id}>
                          <div className="detail-row">
                            <span className="detail-text">Committed Capital</span>
                            <span className="detail-val">₹{i.amount.toLocaleString()}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-text">Equity Held</span>
                            <span className="detail-val">{i.equity?.toFixed(2)}%</span>
                          </div>

                          {/* NOT EXITED */}
                          {!p.isExited && (
                            <div className="status-unrealized">
                              ⏳ Unrealized — Awaiting Exit
                            </div>
                          )}

                          {/* EXITED */}
                          {p.isExited && (
                            <div className="payout-section">
                              <div className="detail-row">
                                <span className="detail-text">Liquidated Payout</span>
                                <span className="detail-val">₹{i.payout?.toLocaleString()}</span>
                              </div>
                              <div className="detail-row" style={{ marginTop: '8px' }}>
                                <span className="detail-text">Net ROI</span>
                                <span className={`detail-val ${i.roi >= 0 ? 'roi-positive' : 'roi-negative'}`}>
                                  {i.roi >= 0 ? "+" : ""}{i.roi?.toFixed(2)}%
                                </span>
                              </div>
                              <span className="exit-date">
                                🗓 Exited on: {new Date(p.exitedAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
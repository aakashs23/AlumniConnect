import { useState } from "react";
import API from "../services/api";
import "./CreateProject.css";

export default function CreateProject() {
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [valuationProposal, setValuationProposal] = useState("");
  const [equityProposal, setEquityProposal] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !problem || !solution || !valuationProposal || !equityProposal) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post(
        "/projects/create",
        {
          title,
          problem,
          solution,
          valuationProposal: Number(valuationProposal),
          equityForSaleProposal: Number(equityProposal),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Project submitted for admin approval!");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      alert("Failed to submit project");
    }
  };

  // prevent admins from accessing creation page
  if (user.role === "admin") {
    return (
      <div className="error-state animate-fade-in">
        <p>⚠️ Admins cannot create projects.</p>
      </div>
    );
  }

  return (
    <div className="create-container animate-fade-in">
      <header className="create-header">
        <h2 className="create-title">Launch Your Startup</h2>
        <p className="create-subtitle">Draft your fundraising proposal for alumni investor review.</p>
      </header>

      <main className="create-content animate-slide-up delay-100">
        <div className="create-card hover-card-effect">
          <form className="create-form" onSubmit={handleSubmit}>

            <div className="form-row">
              <label className="form-label">Project Title</label>
              <input
                className="form-input transition-all"
                placeholder="e.g. Acme AI Solutions"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label className="form-label">The Problem</label>
              <textarea
                className="form-textarea transition-all"
                placeholder="Describe the core issue you are solving..."
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label className="form-label">The Solution</label>
              <textarea
                className="form-textarea transition-all"
                placeholder="Explain how your product uniquely solves this..."
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
              />
            </div>

            <div className="form-grid">
              <div className="form-row">
                <label className="form-label">Proposed Valuation</label>
                <div className="currency-wrapper transition-all">
                  <span className="currency-prefix">₹</span>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="2500000"
                    value={valuationProposal}
                    onChange={(e) => setValuationProposal(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Equity Offered</label>
                <div className="percentage-wrapper transition-all">
                  <input
                    className="form-input"
                    type="number"
                    placeholder="15"
                    value={equityProposal}
                    onChange={(e) => setEquityProposal(e.target.value)}
                  />
                  <span className="percentage-suffix">%</span>
                </div>
              </div>
            </div>

            <button className="btn-submit hover-card-effect" type="submit">
              Submit for Approval
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

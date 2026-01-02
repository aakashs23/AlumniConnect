import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const res = await API.get("/projects/all");

        // Filter projects created by logged-in user
        const filtered = res.data.filter(
          (project) => project.createdBy?._id === user._id
        );

        setMyProjects(filtered);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Dashboard</h2>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <hr style={{ margin: "20px 0" }} />

      <h3>My Projects</h3>

      {loading ? (
        <p>Loading your projects...</p>
      ) : myProjects.length === 0 ? (
        <p>You have not created any projects yet.</p>
      ) : (
        myProjects.map((project) => (
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
            <p><strong>Funds Required:</strong> ₹{project.fundsRequired}</p>
          </div>
        ))
      )}

      <br />

      <button onClick={() => window.location.href = "/create-project"}>
        Create New Project
      </button>

      <button
        style={{ marginLeft: "10px" }}
        onClick={() => window.location.href = "/projects"}
      >
        View All Projects
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";
import API from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects/all");
        setProjects(res.data);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <h2>Loading projects...</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>All Projects</h2>

      {projects.length === 0 ? (
        <p>No projects available</p>
      ) : (
        projects.map((project) => (
          <div
            key={project._id}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            <h3>{project.title}</h3>

            <p><strong>Problem:</strong> {project.problem}</p>
            <p><strong>Solution:</strong> {project.solution}</p>
            <p><strong>Funds Required:</strong> ₹{project.fundsRequired}</p>

            <p style={{ marginTop: "10px", fontStyle: "italic" }}>
              Created by: {project.createdBy?.name} ({project.createdBy?.role})
            </p>
          </div>
        ))
      )}
    </div>
  );
}

import { useState } from "react";
import API from "../services/api";

export default function CreateProject() {
  const [formData, setFormData] = useState({
    title: "",
    problem: "",
    solution: "",
    fundsRequired: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = JSON.parse(localStorage.getItem("user"));

      await API.post(
        "/projects/create",
        {
          title: formData.title,
          problem: formData.problem,
          solution: formData.solution,
          fundsRequired: Number(formData.fundsRequired),
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      alert("Project created successfully 🎉");
    } catch (error) {
      console.error(error);
      alert("Project creation failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Create Project</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Project Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <br /><br />

        <textarea
          name="problem"
          placeholder="Problem Statement"
          value={formData.problem}
          onChange={handleChange}
          required
        />
        <br /><br />

        <textarea
          name="solution"
          placeholder="Proposed Solution"
          value={formData.solution}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="fundsRequired"
          type="number"
          placeholder="Funds Required"
          value={formData.fundsRequired}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Create Project</button>
      </form>
    </div>
  );
}

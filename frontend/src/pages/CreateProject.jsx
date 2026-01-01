import { useState } from "react";
import API from "../services/api";

export default function CreateProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
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

      const res = await API.post(
        "/projects/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      alert("Project created successfully");
      console.log(res.data);
    } catch (err) {
      console.error(err);
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
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="techStack"
          placeholder="Tech Stack (React, Node, Mongo)"
          value={formData.techStack}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Create Project</button>
      </form>
    </div>
  );
}

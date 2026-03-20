import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Registration successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container animate-fade-in">
      <div className="register-card animate-slide-up">
        <div className="register-header">
          <h2>Create an account</h2>
          <p>Join the next generation of founders and investors.</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Jane Doe"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" onChange={handleChange} value={formData.role}>
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>

          <button type="submit" className="btn-register hover-card-effect transition-all">Sign Up</button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}

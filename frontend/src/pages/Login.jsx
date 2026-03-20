import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const res = await API.post("/auth/login", formData);

      // 🔐 SAFELY extract user no matter backend shape
      const loggedInUser =
        res.data.user ??
        res.data;

      if (!loggedInUser || !loggedInUser.role) {
        throw new Error("Invalid login response shape");
      }

      // Save session (token may be inside or outside)
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...loggedInUser,
          token: res.data.token || loggedInUser.token
        })
      );

      // ---- MULTI ACCOUNT STORAGE (SAFE) ----
      const raw = localStorage.getItem("knownUsers");
      const existingUsers = raw ? JSON.parse(raw) : [];

      // Use EMAIL if present, otherwise fallback to _id
      const uniqueKey = loggedInUser.email || loggedInUser._id;

      const alreadyExists = existingUsers.some(
        u => u.email === uniqueKey || u._id === uniqueKey
      );

      if (!alreadyExists) {
        existingUsers.push({
          name: loggedInUser.name,
          email: loggedInUser.email, // may be undefined, OK
          role: loggedInUser.role,
          _id: loggedInUser._id
        });
      }

      localStorage.setItem(
        "knownUsers",
        JSON.stringify(existingUsers)
      );
      // -------------------------------------

      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert("Login failed");
    }
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-card animate-slide-up">
        <div className="login-header">
          <h2>Welcome back</h2>
          <p>Enter your details to access your account.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
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
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-login hover-card-effect transition-all">Log In</button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}

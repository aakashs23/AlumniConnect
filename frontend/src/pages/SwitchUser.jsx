import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SwitchUser.css";

export default function SwitchUser() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("knownUsers")) || [];
    setUsers(stored);

    // ensure logged out
    localStorage.removeItem("user");
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const removeUser = (id) => {
    const updated = users.filter(u => u._id !== id);
    setUsers(updated);
    localStorage.setItem("knownUsers", JSON.stringify(updated));
  };

  return (
    <div className="switch-container animate-fade-in">
      <div className="switch-card animate-slide-up">

        <div className="switch-header">
          <h2>Switch Account</h2>
          <p>Choose an account to continue</p>
        </div>

        {users.length === 0 ? (
          <div className="switch-empty">
            <p>No previously used accounts.</p>
          </div>
        ) : (
          <div className="users-list">
            {users.map((u, index) => (
              <div
                key={u._id}
                className="user-account-card hover-card-effect"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="user-info-section">
                  <div className="user-avatar-circle">
                    {u.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="user-details">
                    <strong>{u.name}</strong>
                    <span className="user-email">{u.email}</span>
                    <span className="user-role-tag">{u.role}</span>
                  </div>
                </div>

                <div className="user-actions">
                  <button className="btn-sign-in" onClick={handleLogin}>
                    Sign in
                  </button>
                  <button
                    className="btn-remove"
                    onClick={() => removeUser(u._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <hr className="switch-divider" />

        <button className="btn-other-account hover-card-effect" onClick={handleLogin}>
          Sign in with another account
        </button>

      </div>
    </div>
  );
}

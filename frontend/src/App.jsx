import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  // check if user is logged in
  const isLoggedIn = !!localStorage.getItem("user");

  return (
    <Routes>
      {/* Default route */}
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected route */}
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
      />

      {/* Fallback */}
      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  );
}

export default App;

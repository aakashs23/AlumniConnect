import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import Marketplace from "./pages/Marketplace";
import Portfolio from "./pages/Portfolio";
import Completed from "./pages/Completed";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  return (
    <Routes>
      {/* Redirect root */}
      <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/marketplace"
        element={isLoggedIn ? <Marketplace /> : <Navigate to="/login" />}
      />
      <Route
        path="/portfolio"
        element={isLoggedIn ? <Portfolio /> : <Navigate to="/login" />}
      />
      <Route
        path="/completed"
        element={isLoggedIn ? <Completed /> : <Navigate to="/login" />}
      />
      <Route
        path="/create-project"
        element={
          isLoggedIn && user.role === "student" ? (
            <CreateProject />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="/portfolio" element={<Portfolio />} />

      {/* Fallback */}
      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  );
}

export default App;
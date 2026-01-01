export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      <h3>Name: {user?.user?.name}</h3>
      <h3>Email: {user?.user?.email}</h3>
      <h3>Role: {user?.user?.role}</h3>

      <button onClick={() => window.location.href = "/create-project"}>
        Create Project
      </button>

      <button onClick={() => window.location.href = "/projects"}>
        View Projects
      </button>
    </div>
  );
}

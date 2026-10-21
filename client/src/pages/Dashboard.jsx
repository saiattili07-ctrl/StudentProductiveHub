import EmptyState from "../components/EmptyState.jsx";

function Dashboard() {
  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">
        Your tasks, deadlines and study progress at a glance.
      </p>

      <EmptyState
        title="Dashboard coming soon"
        description="Real task counts, deadlines and study statistics will appear here in Stage 8."
      />
    </div>
  );
}

export default Dashboard;

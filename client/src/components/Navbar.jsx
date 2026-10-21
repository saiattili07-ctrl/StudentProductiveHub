import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="app-navbar">
      <div className="d-flex align-items-center">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          &#9776;
        </button>
        <Link to="/dashboard" className="app-brand">
          Student<span> Productivity Hub</span>
        </Link>
      </div>
      <div className="d-flex align-items-center gap-3">
        <span className="text-muted small">{user ? user.name : ""}</span>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </header>
  );
}

export default Navbar;

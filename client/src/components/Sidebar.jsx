import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tasks", label: "Tasks" },
  { to: "/study", label: "Study Planner" },
  { to: "/analytics", label: "Analytics" },
  { to: "/profile", label: "Profile" },
];

function Sidebar({ isOpen, onNavigate }) {
  return (
    <aside className={`app-sidebar ${isOpen ? "open" : ""}`}>
      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

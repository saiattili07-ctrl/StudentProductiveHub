import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-wrapper">
      <div className="not-found-code">404</div>
      <h2 className="mt-3">Page not found</h2>
      <p className="text-muted">
        The page you are looking for does not exist yet.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;

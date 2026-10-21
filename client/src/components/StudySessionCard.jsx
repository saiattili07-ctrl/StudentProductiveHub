import { formatDate, formatDuration } from "../utils/formatDate.js";

function StudySessionCard({ session, onEdit, onDelete, onComplete }) {
  const done = session.status === "completed";

  return (
    <div className={`card-surface item-card ${done ? "completed" : ""}`}>
      <div className="d-flex justify-content-between flex-wrap gap-2 mb-2">
        <div>
          <h3 className="item-title h6">{session.subject}</h3>
          {session.notes && (
            <p className="text-muted small mb-0 mt-1">{session.notes}</p>
          )}
        </div>
        <div className="d-flex gap-2 align-items-start">
          {session.status === "planned" && (
            <button
              type="button"
              className="btn btn-sm btn-success"
              onClick={() => onComplete(session)}
            >
              Complete
            </button>
          )}
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => onEdit(session)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(session)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="meta-row">
        <span className={`badge badge-status-${session.status}`}>
          {session.status}
        </span>
        <span>{formatDate(session.date)}</span>
        <span>
          {session.startTime} - {session.endTime}
        </span>
        <span>Duration: {formatDuration(session.durationMinutes)}</span>
      </div>
    </div>
  );
}

export default StudySessionCard;

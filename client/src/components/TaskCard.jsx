import { formatDate, isOverdue } from "../utils/formatDate.js";

function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  const done = task.status === "completed";
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className={`card-surface item-card ${done ? "completed" : ""}`}>
      <div className="d-flex justify-content-between flex-wrap gap-2 mb-2">
        <div>
          <h3 className="item-title h6">{task.title}</h3>
          {task.description && (
            <p className="text-muted small mb-0 mt-1">{task.description}</p>
          )}
        </div>
        <div className="d-flex gap-2 align-items-start">
          <button
            type="button"
            className={`btn btn-sm ${done ? "btn-outline-secondary" : "btn-success"}`}
            onClick={() => onToggleComplete(task)}
          >
            {done ? "Reopen" : "Complete"}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => onEdit(task)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(task)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="meta-row">
        <span className={`badge badge-status-${task.status}`}>
          {task.status}
        </span>
        <span className={`badge badge-priority-${task.priority}`}>
          {task.priority}
        </span>
        <span>Subject: {task.subject}</span>
        <span>Due: {formatDate(task.dueDate)}</span>
        {overdue && <span className="badge badge-overdue">Overdue</span>}
      </div>
    </div>
  );
}

export default TaskCard;

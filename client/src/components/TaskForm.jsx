import { useState } from "react";
import { toInputDate } from "../utils/formatDate.js";

function TaskForm({
  task = null,
  onSubmit,
  onCancel,
  submitting = false,
  error = "",
}) {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    subject: task?.subject || "General",
    priority: task?.priority || "medium",
    status: task?.status || "pending",
    dueDate: toInputDate(task?.dueDate),
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      subject: form.subject.trim() || "General",
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || null,
    });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-panel">
        <h2 className="h5 mb-3">{task ? "Edit task" : "Add task"}</h2>

        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="task-title" className="form-label">
              Title
            </label>
            <input
              id="task-title"
              name="title"
              className="form-control"
              value={form.title}
              onChange={handleChange}
              maxLength={120}
              required
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label htmlFor="task-description" className="form-label">
              Description
            </label>
            <textarea
              id="task-description"
              name="description"
              className="form-control"
              rows={3}
              value={form.description}
              onChange={handleChange}
              maxLength={1000}
            />
          </div>
          <div className="row">
            <div className="col-sm-6 mb-3">
              <label htmlFor="task-subject" className="form-label">
                Subject
              </label>
              <input
                id="task-subject"
                name="subject"
                className="form-control"
                value={form.subject}
                onChange={handleChange}
                maxLength={60}
              />
            </div>
            <div className="col-sm-6 mb-3">
              <label htmlFor="task-due" className="form-label">
                Due date
              </label>
              <input
                id="task-due"
                name="dueDate"
                type="date"
                className="form-control"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-6 mb-3">
              <label htmlFor="task-priority" className="form-label">
                Priority
              </label>
              <select
                id="task-priority"
                name="priority"
                className="form-select"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="col-sm-6 mb-3">
              <label htmlFor="task-status" className="form-label">
                Status
              </label>
              <select
                id="task-status"
                name="status"
                className="form-select"
                value={form.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;

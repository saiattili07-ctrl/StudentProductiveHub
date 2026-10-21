import { useState } from "react";
import { toInputDate, todayInputDate } from "../utils/formatDate.js";

function StudySessionForm({
  session = null,
  onSubmit,
  onCancel,
  submitting = false,
  error = "",
}) {
  const [form, setForm] = useState({
    subject: session?.subject || "",
    date: session ? toInputDate(session.date) : todayInputDate(),
    startTime: session?.startTime || "09:00",
    endTime: session?.endTime || "10:00",
    status: session?.status || "planned",
    notes: session?.notes || "",
  });
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.endTime <= form.startTime) {
      setLocalError("End time must be after start time");
      return;
    }
    setLocalError("");
    onSubmit({
      subject: form.subject.trim(),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      status: form.status,
      notes: form.notes.trim(),
    });
  };

  const shownError = localError || error;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-panel">
        <h2 className="h5 mb-3">
          {session ? "Edit study session" : "Plan study session"}
        </h2>

        {shownError && (
          <div className="alert alert-danger py-2 small" role="alert">
            {shownError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="ss-subject" className="form-label">
              Subject
            </label>
            <input
              id="ss-subject"
              name="subject"
              className="form-control"
              value={form.subject}
              onChange={handleChange}
              maxLength={60}
              required
              autoFocus
            />
          </div>
          <div className="row">
            <div className="col-sm-4 mb-3">
              <label htmlFor="ss-date" className="form-label">
                Date
              </label>
              <input
                id="ss-date"
                name="date"
                type="date"
                className="form-control"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-sm-4 mb-3">
              <label htmlFor="ss-start" className="form-label">
                Start time
              </label>
              <input
                id="ss-start"
                name="startTime"
                type="time"
                className="form-control"
                value={form.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-sm-4 mb-3">
              <label htmlFor="ss-end" className="form-label">
                End time
              </label>
              <input
                id="ss-end"
                name="endTime"
                type="time"
                className="form-control"
                value={form.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="ss-status" className="form-label">
              Status
            </label>
            <select
              id="ss-status"
              name="status"
              className="form-select"
              value={form.status}
              onChange={handleChange}
            >
              <option value="planned">Planned</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="ss-notes" className="form-label">
              Notes
            </label>
            <textarea
              id="ss-notes"
              name="notes"
              className="form-control"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              maxLength={500}
            />
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
              {submitting ? "Saving..." : "Save session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudySessionForm;

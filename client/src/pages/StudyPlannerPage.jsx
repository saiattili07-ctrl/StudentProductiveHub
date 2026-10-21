import { useCallback, useEffect, useState } from "react";

import StudySessionCard from "../components/StudySessionCard.jsx";
import StudySessionForm from "../components/StudySessionForm.jsx";
import Pagination from "../components/Pagination.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { getErrorMessage } from "../services/api.js";
import {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
  completeSession,
} from "../services/studyService.js";

function StudyPlannerPage() {
  const [sessions, setSessions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [status, setStatus] = useState("");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 8, order };
      if (status) params.status = status;
      const data = await getSessions(params);
      setSessions(data.sessions);
      setPagination(data.pagination);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load study sessions"));
    } finally {
      setLoading(false);
    }
  }, [page, status, order]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const openCreate = () => {
    setEditing(null);
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (session) => {
    setEditing(session);
    setFormError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setFormError("");
    try {
      if (editing) {
        await updateSession(editing._id, payload);
        setNotice("Study session updated");
      } else {
        await createSession(payload);
        setNotice("Study session created");
      }
      closeForm();
      await loadSessions();
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not save the study session"));
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (session) => {
    try {
      await completeSession(session._id);
      setNotice("Study session completed");
      await loadSessions();
    } catch (err) {
      setError(getErrorMessage(err, "Could not complete the session"));
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteSession(toDelete._id);
      setNotice("Study session deleted");
      setToDelete(null);
      if (sessions.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        await loadSessions();
      }
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete the session"));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="toolbar">
        <div>
          <h1 className="page-title mb-0">Study Planner</h1>
          <p className="page-subtitle mb-0">
            {pagination.total} session(s) found
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          + Plan session
        </button>
      </div>

      {notice && (
        <div
          className="alert alert-success alert-dismissible py-2 small"
          role="status"
        >
          {notice}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setNotice("")}
          ></button>
        </div>
      )}

      <div className="card-surface filters-row">
        <div>
          <label htmlFor="sp-status" className="form-label small mb-1">
            Status
          </label>
          <select
            id="sp-status"
            className="form-select form-select-sm"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All</option>
            <option value="planned">Planned</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
          </select>
        </div>
        <div>
          <label htmlFor="sp-order" className="form-label small mb-1">
            Order
          </label>
          <select
            id="sp-order"
            className="form-select form-select-sm"
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(1);
            }}
          >
            <option value="desc">Latest first</option>
            <option value="asc">Earliest first</option>
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadSessions} />}

      {loading ? (
        <LoadingSpinner message="Loading study sessions..." />
      ) : sessions.length === 0 ? (
        <EmptyState
          title="No study sessions yet"
          description="Plan your first session to start tracking study time."
        />
      ) : (
        <>
          {sessions.map((session) => (
            <StudySessionCard
              key={session._id}
              session={session}
              onEdit={openEdit}
              onDelete={setToDelete}
              onComplete={handleComplete}
            />
          ))}
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            onPageChange={setPage}
          />
        </>
      )}

      {formOpen && (
        <StudySessionForm
          session={editing}
          onSubmit={handleSave}
          onCancel={closeForm}
          submitting={saving}
          error={formError}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete study session?"
          message={`The "${toDelete.subject}" session will be permanently deleted.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setToDelete(null)}
          busy={deleting}
        />
      )}
    </div>
  );
}

export default StudyPlannerPage;

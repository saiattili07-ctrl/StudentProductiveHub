import { useCallback, useEffect, useState } from "react";

import SearchBar from "../components/SearchBar.jsx";
import TaskFilters from "../components/TaskFilters.jsx";
import TaskList from "../components/TaskList.jsx";
import TaskForm from "../components/TaskForm.jsx";
import Pagination from "../components/Pagination.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { getErrorMessage } from "../services/api.js";
import {
  getTasks,
  getTaskSubjects,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  reopenTask,
} from "../services/taskServices.js";

const DEFAULT_FILTERS = {
  status: "",
  priority: "",
  subject: "",
  sortBy: "createdAt",
  order: "desc",
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");
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

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit: 8,
        sortBy: filters.sortBy,
        order: filters.order,
      };
      if (search) params.search = search;
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.subject) params.subject = filters.subject;

      const data = await getTasks(params);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load tasks"));
    } finally {
      setLoading(false);
    }
  }, [page, search, filters]);

  const loadSubjects = useCallback(async () => {
    try {
      setSubjects(await getTaskSubjects());
    } catch {
      setSubjects([]);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleSearch = (text) => {
    setSearch(text);
    setPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
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
        await updateTask(editing._id, payload);
        setNotice("Task updated");
      } else {
        await createTask(payload);
        setNotice("Task created");
      }
      closeForm();
      await Promise.all([loadTasks(), loadSubjects()]);
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not save the task"));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      if (task.status === "completed") {
        await reopenTask(task._id);
        setNotice("Task reopened");
      } else {
        await completeTask(task._id);
        setNotice("Task completed");
      }
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err, "Could not update the task"));
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(toDelete._id);
      setNotice("Task deleted");
      setToDelete(null);
      if (tasks.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        await loadTasks();
      }
      await loadSubjects();
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete the task"));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="toolbar">
        <div>
          <h1 className="page-title mb-0">Tasks</h1>
          <p className="page-subtitle mb-0">{pagination.total} task(s) found</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          + Add task
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

      <div className="mb-3">
        <SearchBar
          value={search}
          onSearch={handleSearch}
          placeholder="Search by title, description or subject"
        />
      </div>

      <TaskFilters
        filters={filters}
        subjects={subjects}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {error && <ErrorMessage message={error} onRetry={loadTasks} />}

      {loading ? (
        <LoadingSpinner message="Loading tasks..." />
      ) : (
        <>
          <TaskList
            tasks={tasks}
            onEdit={openEdit}
            onDelete={setToDelete}
            onToggleComplete={handleToggleComplete}
          />
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            onPageChange={setPage}
          />
        </>
      )}

      {formOpen && (
        <TaskForm
          task={editing}
          onSubmit={handleSave}
          onCancel={closeForm}
          submitting={saving}
          error={formError}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete task?"
          message={`"${toDelete.title}" will be permanently deleted.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setToDelete(null)}
          busy={deleting}
        />
      )}
    </div>
  );
}

export default Tasks;
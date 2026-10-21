function TaskFilters({ filters, subjects, onChange, onReset }) {
  return (
    <div className="card-surface filters-row">
      <div>
        <label htmlFor="f-status" className="form-label small mb-1">
          Status
        </label>
        <select
          id="f-status"
          className="form-select form-select-sm"
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div>
        <label htmlFor="f-priority" className="form-label small mb-1">
          Priority
        </label>
        <select
          id="f-priority"
          className="form-select form-select-sm"
          value={filters.priority}
          onChange={(e) => onChange("priority", e.target.value)}
        >
          <option value="">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div>
        <label htmlFor="f-subject" className="form-label small mb-1">
          Subject
        </label>
        <select
          id="f-subject"
          className="form-select form-select-sm"
          value={filters.subject}
          onChange={(e) => onChange("subject", e.target.value)}
        >
          <option value="">All</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="f-sort" className="form-label small mb-1">
          Sort by
        </label>
        <select
          id="f-sort"
          className="form-select form-select-sm"
          value={filters.sortBy}
          onChange={(e) => onChange("sortBy", e.target.value)}
        >
          <option value="createdAt">Created date</option>
          <option value="dueDate">Due date</option>
          <option value="title">Title</option>
          <option value="updatedAt">Last updated</option>
        </select>
      </div>
      <div>
        <label htmlFor="f-order" className="form-label small mb-1">
          Order
        </label>
        <select
          id="f-order"
          className="form-select form-select-sm"
          value={filters.order}
          onChange={(e) => onChange("order", e.target.value)}
        >
          <option value="desc">Newest / Z-A first</option>
          <option value="asc">Oldest / A-Z first</option>
        </select>
      </div>
      <div>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary w-100"
          onClick={onReset}
        >
          Reset filters
        </button>
      </div>
    </div>
  );
}

export default TaskFilters;

function Pagination({ page, pages, onPageChange }) {
  if (!pages || pages <= 1) return null;

  return (
    <nav
      className="d-flex justify-content-center align-items-center gap-3 mt-3"
      aria-label="Pagination"
    >
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>
      <span className="small text-muted">
        Page {page} of {pages}
      </span>
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;
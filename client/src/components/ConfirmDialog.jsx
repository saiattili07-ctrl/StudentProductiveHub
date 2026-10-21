function ConfirmDialog({
  title = "Are you sure?",
  message = "",
  confirmText = "Delete",
  onConfirm,
  onCancel,
  busy = false,
}) {
  return (
    <div className="modal-overlay" role="alertdialog" aria-modal="true">
      <div className="modal-panel" style={{ maxWidth: 420 }}>
        <h2 className="h5">{title}</h2>
        <p className="text-muted">{message}</p>
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;

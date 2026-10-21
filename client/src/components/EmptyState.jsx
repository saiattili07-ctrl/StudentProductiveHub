function EmptyState({
  title = "Nothing here yet",
  description = "",
  children,
}) {
  return (
    <div className="status-box card-surface">
      <h5 className="mb-2">{title}</h5>
      {description && <p className="text-muted mb-3">{description}</p>}
      {children}
    </div>
  );
}

export default EmptyState;

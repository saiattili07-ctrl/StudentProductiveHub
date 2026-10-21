const VARIANT_CLASSES = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
};

function DashboardCard({ title, value, variant = 'primary' }) {
  return (
    <div className="card-surface panel">
      <div className="text-muted small mb-1">{title}</div>
      <div className={`fs-3 fw-semibold ${VARIANT_CLASSES[variant] || ''}`}>{value}</div>
    </div>
  );
}

export default DashboardCard;
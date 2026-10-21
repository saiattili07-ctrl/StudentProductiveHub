function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="text-center py-5" role="status">
      <div className="spinner-border text-primary" aria-hidden="true"></div>
      <div className="text-muted mt-2">{message}</div>
    </div>
  );
}

export default LoadingSpinner;
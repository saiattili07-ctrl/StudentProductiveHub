import { formatDate } from '../utils/formatDate.js';

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

function ProfileCard({ user }) {
  return (
    <div className="card-surface panel">
      <div className="d-flex align-items-center gap-3 mb-3">
        <div className="avatar-circle">{initials(user.name)}</div>
        <div>
          <h2 className="h5 mb-0">{user.name}</h2>
          <div className="text-muted small">{user.email}</div>
        </div>
      </div>
      <dl className="mb-0 small">
        <dt className="text-muted">Institution</dt>
        <dd>{user.institution || '-'}</dd>
        <dt className="text-muted">Course</dt>
        <dd>{user.course || '-'}</dd>
        <dt className="text-muted">About</dt>
        <dd>{user.bio || '-'}</dd>
        <dt className="text-muted">Member since</dt>
        <dd className="mb-0">{formatDate(user.createdAt)}</dd>
      </dl>
    </div>
  );
}

export default ProfileCard;
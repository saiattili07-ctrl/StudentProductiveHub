import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard.jsx';
import ProfileForm from '../components/ProfileForm.jsx';
import ChangePasswordForm from '../components/ChangePasswordForm.jsx';
import useAuth from '../hooks/useAuth.js';

function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div>
      <div className="toolbar">
        <div>
          <h1 className="page-title mb-0">Profile</h1>
          <p className="page-subtitle mb-0">Manage your account details and password.</p>
        </div>
        <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>
          Log out
        </button>
      </div>

      <div className="two-col-grid">
        <ProfileCard user={user} />
        <ProfileForm key={user.updatedAt} user={user} onSaved={setUser} />
      </div>

      <div style={{ maxWidth: 520 }}>
        <ChangePasswordForm />
      </div>
    </div>
  );
}

export default Profile;
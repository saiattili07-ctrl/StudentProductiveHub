import { useState } from 'react';
import { updateProfile } from '../services/profileService.js';
import { getErrorMessage } from '../services/api.js';

function ProfileForm({ user, onSaved }) {
  const [form, setForm] = useState({
    name: user.name || '',
    institution: user.institution || '',
    course: user.course || '',
    bio: user.bio || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const updated = await updateProfile(form);
      onSaved(updated);
      setSuccess('Profile updated');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update the profile'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card-surface panel">
      <h2 className="h6 mb-3">Edit profile</h2>

      {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}
      {success && <div className="alert alert-success py-2 small" role="status">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="pf-name" className="form-label">Name</label>
          <input id="pf-name" name="name" className="form-control" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="pf-email" className="form-label">Email</label>
          <input id="pf-email" className="form-control" value={user.email} disabled />
          <div className="form-text">Email cannot be changed.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="pf-institution" className="form-label">Institution</label>
          <input id="pf-institution" name="institution" className="form-control" value={form.institution} onChange={handleChange} maxLength={100} />
        </div>
        <div className="mb-3">
          <label htmlFor="pf-course" className="form-label">Course</label>
          <input id="pf-course" name="course" className="form-control" value={form.course} onChange={handleChange} maxLength={100} />
        </div>
        <div className="mb-3">
          <label htmlFor="pf-bio" className="form-label">About you</label>
          <textarea id="pf-bio" name="bio" className="form-control" rows={3} value={form.bio} onChange={handleChange} maxLength={300} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}

export default ProfileForm;
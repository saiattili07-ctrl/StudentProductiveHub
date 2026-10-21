import { useState } from 'react';
import { changePassword } from '../services/profileService.js';
import { getErrorMessage } from '../services/api.js';

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' };

function ChangePasswordForm() {
  const [form, setForm] = useState(EMPTY);
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

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess('Password changed successfully');
      setForm(EMPTY);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not change the password'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card-surface panel">
      <h2 className="h6 mb-3">Change password</h2>

      {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}
      {success && <div className="alert alert-success py-2 small" role="status">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="cp-current" className="form-label">Current password</label>
          <input id="cp-current" name="currentPassword" type="password" className="form-control" value={form.currentPassword} onChange={handleChange} autoComplete="current-password" required />
        </div>
        <div className="mb-3">
          <label htmlFor="cp-new" className="form-label">New password</label>
          <input id="cp-new" name="newPassword" type="password" className="form-control" value={form.newPassword} onChange={handleChange} autoComplete="new-password" required />
          <div className="form-text">At least 8 characters, with letters and numbers.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="cp-confirm" className="form-label">Confirm new password</label>
          <input id="cp-confirm" name="confirmPassword" type="password" className="form-control" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password" required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordForm;
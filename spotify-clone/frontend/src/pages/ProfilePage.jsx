import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ username: user?.username ?? '', bio: user?.bio ?? '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar_url ?? null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      const formData = new FormData();
      formData.append('username', form.username);
      formData.append('bio', form.bio);
      if (avatarFile) formData.append('avatar', avatarFile);
      const updated = await authService.updateProfile(formData);
      updateUser(updated);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      const data = err.response?.data ?? {};
      setError(data.username?.[0] ?? data.detail ?? 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '32px' }}>Profile</h1>

      <form onSubmit={handleSubmit}>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', background: 'var(--color-surface-hover)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>
            {preview
              ? <img src={preview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span>{user?.username?.[0]?.toUpperCase()}</span>
            }
          </div>
          <div>
            <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
              Choose photo
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </label>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '8px' }}>JPG, PNG. Max 2MB.</p>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="username">Display name</label>
          <input id="username" name="username" className="input" value={form.username} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" className="input" value={form.bio} onChange={handleChange} rows={3} placeholder="Tell us about yourself" style={{ resize: 'vertical' }} />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="input" value={user?.email ?? ''} disabled style={{ opacity: 0.5 }} />
        </div>

        {success && <p style={{ color: 'var(--color-green)', marginBottom: '12px', fontSize: '14px' }}>{success}</p>}
        {error && <p className="form-error" style={{ marginBottom: '12px' }}>{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
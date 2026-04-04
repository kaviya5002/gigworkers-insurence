import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import SettingsSection from '../components/settings/SettingsSection';
import api from '../api/axios';
import './UserDashboard.css';
import './UserProfile.css';

function UserProfile() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const [profile, setProfile]   = useState({ name: '', email: '', phone: '', address: '', city: '', vehicleType: '' });
  const [notifs, setNotifs]     = useState({ email: true, sms: false, claimAlerts: true, premiumReminder: true });
  const [theme, setTheme]       = useState('light');
  const [editing, setEditing]   = useState(false);
  const [pwForm, setPwForm]     = useState({ current: '', next: '', confirm: '' });
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState(null);

  // Load profile on mount
  useEffect(() => {
    // Try backend first, fall back to localStorage
    api.get('/user/profile').then(({ data }) => {
      if (data.success) {
        const u = data.data;
        setProfile({ name: u.name || '', email: u.email || '', phone: u.phone || '', address: u.address || '', city: u.city || '', vehicleType: u.vehicleType || '' });
        setNotifs(u.notifications || notifs);
        setTheme(u.theme || 'light');
      }
    }).catch(() => {
      // Load from localStorage
      const stored = JSON.parse(localStorage.getItem('userProfile') || 'null');
      if (stored) {
        setProfile({ name: stored.name || user?.name || '', email: stored.email || user?.email || '', phone: stored.phone || '', address: stored.address || '', city: stored.city || '', vehicleType: stored.vehicleType || '' });
        setNotifs(stored.notifications || notifs);
        setTheme(stored.theme || 'light');
      } else if (user) {
        setProfile(p => ({ ...p, name: user.name || '', email: user.email || '' }));
      }
    });
  }, []);

  const flash = (text, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/user/profile/update', profile);
    } catch {
      // Save to localStorage as fallback
      const existing = JSON.parse(localStorage.getItem('userProfile') || '{}');
      localStorage.setItem('userProfile', JSON.stringify({ ...existing, ...profile }));
      // Also update AuthContext user name
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...storedUser, name: profile.name, email: profile.email }));
    }
    flash('Profile saved successfully');
    setEditing(false);
    setSaving(false);
  };

  const handleSaveSettings = async (patch) => {
    try {
      await api.put('/user/settings/update', patch);
    } catch {
      // Save to localStorage as fallback
      const existing = JSON.parse(localStorage.getItem('userProfile') || '{}');
      localStorage.setItem('userProfile', JSON.stringify({ ...existing, ...patch }));
    }
    flash('Settings updated');
  };

  const handleToggleNotif = (key) => {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    handleSaveSettings({ notifications: updated });
  };

  const handleTheme = (val) => {
    setTheme(val);
    handleSaveSettings({ theme: val });
    if (val === 'dark'  && !isDarkMode) toggleDarkMode();
    if (val === 'light' &&  isDarkMode) toggleDarkMode();
  };

  const handleChangePassword = async () => {
    if (!pwForm.current || !pwForm.next) return flash('Fill in all password fields', false);
    if (pwForm.next !== pwForm.confirm)  return flash('New passwords do not match', false);
    if (pwForm.next.length < 8)          return flash('Password must be at least 8 characters', false);
    try {
      await api.put('/user/settings/update', { currentPassword: pwForm.current, newPassword: pwForm.next });
    } catch {
      // Update password in localStorage users list
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const idx = users.findIndex(u => u.email === profile.email);
      if (idx !== -1) {
        if (users[idx].password !== pwForm.current) return flash('Current password is incorrect', false);
        users[idx].password = pwForm.next;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
    flash('Password changed successfully');
    setPwForm({ current: '', next: '', confirm: '' });
  };

  const notifItems = [
    { key: 'email',           label: 'Email Notifications',  description: 'Receive updates via email',          value: notifs.email,           onChange: () => handleToggleNotif('email') },
    { key: 'sms',             label: 'SMS Notifications',    description: 'Receive alerts via SMS',             value: notifs.sms,             onChange: () => handleToggleNotif('sms') },
    { key: 'claimAlerts',     label: 'Claim Alerts',         description: 'Get notified on claim status changes', value: notifs.claimAlerts,   onChange: () => handleToggleNotif('claimAlerts') },
    { key: 'premiumReminder', label: 'Premium Reminders',    description: 'Reminders before premium due date',  value: notifs.premiumReminder, onChange: () => handleToggleNotif('premiumReminder') },
  ];

  return (
    <div className="user-dashboard">
      {/* ── Header — same as UserDashboard ── */}
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <h1>My Profile ⚙️</h1>
          <p>Manage your account information and preferences</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => navigate('/user-dashboard')}>← Dashboard</button>
          <button className="btn btn-primary" onClick={logout}>Logout</button>
        </div>
      </motion.div>

      {/* ── Flash message ── */}
      {msg && (
        <div className={`profile-flash ${msg.ok ? 'profile-flash--ok' : 'profile-flash--err'}`}>
          {msg.text}
        </div>
      )}

      <div className="profile-grid">
        {/* ── Left column ── */}
        <div className="profile-col">

          {/* Profile Information */}
          <motion.div className="card profile-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="profile-card__head">
              <div className="profile-avatar">
                {profile.name ? profile.name[0].toUpperCase() : '?'}
              </div>
              <div>
                <h3 className="profile-card__name">{profile.name || '—'}</h3>
                <span className="profile-card__role">Rider</span>
              </div>
            </div>

            <div className="profile-fields">
              {[
                { label: 'Full Name',     key: 'name',        type: 'text' },
                { label: 'Email',         key: 'email',       type: 'email', disabled: true },
                { label: 'Phone Number',  key: 'phone',       type: 'tel' },
                { label: 'Address',       key: 'address',     type: 'text' },
                { label: 'City',          key: 'city',        type: 'text' },
                { label: 'Vehicle Type',  key: 'vehicleType', type: 'text' },
              ].map(({ label, key, type, disabled }) => (
                <div key={key} className="profile-field">
                  <label className="profile-field__label">{label}</label>
                  <input
                    className="profile-field__input"
                    type={type}
                    value={profile[key]}
                    disabled={!editing || disabled}
                    onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <div className="profile-card__actions">
              {editing ? (
                <>
                  <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
                </>
              ) : (
                <button className="btn btn-outline" onClick={() => setEditing(true)}>Edit Profile</button>
              )}
            </div>
          </motion.div>

          {/* Security */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="settings-section__title" style={{ marginBottom: '1rem' }}>Security</h3>
            <div className="profile-fields">
              {[
                { label: 'Current Password', key: 'current', type: 'password' },
                { label: 'New Password',     key: 'next',    type: 'password' },
                { label: 'Confirm Password', key: 'confirm', type: 'password' },
              ].map(({ label, key, type }) => (
                <div key={key} className="profile-field">
                  <label className="profile-field__label">{label}</label>
                  <input
                    className="profile-field__input"
                    type={type}
                    value={pwForm[key]}
                    onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              ))}
            </div>
            <div className="profile-card__actions" style={{ marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={handleChangePassword}>Change Password</button>
              <button className="btn btn-outline" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }} onClick={logout}>Logout</button>
            </div>
          </motion.div>
        </div>

        {/* ── Right column ── */}
        <div className="profile-col">

          {/* Notification Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <SettingsSection title="Notification Settings" items={notifItems} />
          </motion.div>

          {/* Appearance */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h3 className="settings-section__title" style={{ marginBottom: '1rem' }}>Appearance</h3>
            <div className="theme-options">
              {[
                { val: 'light',  label: '☀️ Light Mode' },
                { val: 'dark',   label: '🌙 Dark Mode' },
                { val: 'system', label: '💻 System Default' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  className={`theme-btn ${theme === val ? 'theme-btn--active' : ''}`}
                  onClick={() => handleTheme(val)}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

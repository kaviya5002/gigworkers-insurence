import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SettingsSection from '../components/settings/SettingsSection';
import api from '../api/axios';
import './AdminDashboard.css';
import './UserProfile.css';
import './AdminProfile.css';

function AdminProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState({
    maintenanceMode: false, autoClaimApproval: false, fraudAlertsEnabled: true,
    newClaimNotifs: true, fraudDetectionAlerts: true, systemErrorAlerts: true,
  });
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    api.get('/admin/profile').then(({ data }) => {
      if (data.success) {
        setProfile(data.data);
        if (data.data.adminSettings) setSettings({ ...settings, ...data.data.adminSettings });
      }
    }).catch(() => {});
  }, []);

  const flash = (text, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleToggle = async (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    try {
      await api.put('/admin/settings/update', { adminSettings: updated });
      flash('Settings updated');
    } catch { flash('Failed to update settings', false); }
  };

  const systemItems = [
    { key: 'maintenanceMode',   label: 'Maintenance Mode',      description: 'Disable rider access during maintenance', value: settings.maintenanceMode,   onChange: () => handleToggle('maintenanceMode') },
    { key: 'autoClaimApproval', label: 'Auto Claim Approval',   description: 'Automatically approve low-risk claims',   value: settings.autoClaimApproval, onChange: () => handleToggle('autoClaimApproval') },
    { key: 'fraudAlertsEnabled',label: 'Fraud Alerts',          description: 'Enable AI fraud detection alerts',        value: settings.fraudAlertsEnabled,onChange: () => handleToggle('fraudAlertsEnabled') },
  ];

  const notifItems = [
    { key: 'newClaimNotifs',       label: 'New Claim Notifications',  description: 'Alert when a new claim is submitted',  value: settings.newClaimNotifs,       onChange: () => handleToggle('newClaimNotifs') },
    { key: 'fraudDetectionAlerts', label: 'Fraud Detection Alerts',   description: 'Alert on high fraud score claims',     value: settings.fraudDetectionAlerts, onChange: () => handleToggle('fraudDetectionAlerts') },
    { key: 'systemErrorAlerts',    label: 'System Error Alerts',      description: 'Alert on backend performance issues',  value: settings.systemErrorAlerts,    onChange: () => handleToggle('systemErrorAlerts') },
  ];

  const adminName = user?.name?.split(' ')[0] || 'Admin';

  return (
    <div className="admin-dashboard">
      {/* ── Header — same as AdminDashboard ── */}
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <h1>Admin Profile ⚙️</h1>
          <p>Welcome, {adminName} — Manage your admin settings</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => navigate('/admin-dashboard')}>← Dashboard</button>
          <button className="btn btn-primary" onClick={logout}>Logout</button>
        </div>
      </motion.div>

      {msg && (
        <div className={`profile-flash ${msg.ok ? 'profile-flash--ok' : 'profile-flash--err'}`}>
          {msg.text}
        </div>
      )}

      <div className="profile-grid">
        {/* ── Left column ── */}
        <div className="profile-col">

          {/* Admin Information */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="profile-card__head">
              <div className="profile-avatar admin-avatar">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <h3 className="profile-card__name">{user?.name || '—'}</h3>
                <span className="profile-card__role">Administrator</span>
              </div>
            </div>

            <div className="profile-fields">
              {[
                { label: 'Admin Name',  value: profile?.name  || user?.name  || '—' },
                { label: 'Email',       value: profile?.email || user?.email || '—' },
                { label: 'Role',        value: 'Admin' },
                { label: 'Department',  value: 'Insurance Operations' },
                { label: 'Last Login',  value: profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'Just now' },
              ].map(({ label, value }) => (
                <div key={label} className="profile-field">
                  <label className="profile-field__label">{label}</label>
                  <input className="profile-field__input" value={value} disabled readOnly />
                </div>
              ))}
            </div>
          </motion.div>

          {/* System Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SettingsSection title="System Settings" items={systemItems} />
          </motion.div>
        </div>

        {/* ── Right column ── */}
        <div className="profile-col">

          {/* Notification Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <SettingsSection title="Notification Settings" items={notifItems} />
          </motion.div>

          {/* Quick Actions */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h3 className="settings-section__title" style={{ marginBottom: '1rem' }}>Quick Actions</h3>
            <div className="profile-card__actions">
              <button className="btn btn-outline" onClick={() => navigate('/admin-dashboard')}>View Dashboard</button>
              <button className="btn btn-primary" style={{ background: '#EF4444', borderColor: '#EF4444' }} onClick={logout}>Logout</button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;

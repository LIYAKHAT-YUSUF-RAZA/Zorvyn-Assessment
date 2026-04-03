import { useState } from 'react';
import { User, Mail, Globe, Bell, Lock, Shield, Moon, Check, AlertCircle, Smartphone, MapPin, CreditCard, Eye, LogOut, Smartphone as DeviceIcon, Eye as PrivacyIcon, Code, Link2, Trash2, Copy } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';
import PageTabs from '../components/PageTabs';

export default function SettingsPage() {
  const { 
    profile, updateProfile, 
    preferences, updatePreferences, 
    security, updateSecurity,
    theme, toggleTheme,
    canUpdateProfile,
    canUpdateSecurity,
    userRole
  } = useFinanceStore();

  const [localProfile, setLocalProfile] = useState({
    ...profile,
    phone: profile.phone || '+1 (555) 123-4567',
    country: profile.country || 'United States',
    city: profile.city || 'San Francisco, CA',
    company: profile.company || 'Tech Innovations Inc.',
    jobTitle: profile.jobTitle || 'Senior Product Manager',
    bio: profile.bio || 'Passionate about financial technology and innovation.',
  });
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedApiKey, setCopiedApiKey] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState(false);
  const [expandedNotifications, setExpandedNotifications] = useState(false);
  const [preferencesSaved, setPreferencesSaved] = useState(false);
  const [securitySaved, setSecuritySaved] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    transactionAlerts: true,
    securityUpdates: true,
    weeklySummary: true,
    promotions: false,
    productUpdates: true,
  });
  const [disconnectedSessions, setDisconnectedSessions] = useState([]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!canUpdateProfile()) return;
    updateProfile(localProfile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopyApiKey = () => {
    const apiKey = 'sk-live-4eC39HqLyjWDarhtT881A42A';
    navigator.clipboard.writeText(apiKey);
    setCopiedApiKey(true);
    setTimeout(() => setCopiedApiKey(false), 2000);
  };

  const handleSavePreferences = () => {
    updatePreferences(preferences);
    setPreferencesSaved(true);
    setTimeout(() => setPreferencesSaved(false), 3000);
  };

  const handleSaveSecurity = () => {
    updateSecurity(security);
    setSecuritySaved(true);
    setTimeout(() => setSecuritySaved(false), 3000);
  };

  const handleToggleNotification = (key) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    });
  };

  const handleDisconnectSession = (sessionId) => {
    setDisconnectedSessions([...disconnectedSessions, sessionId]);
  };

  const handleConnectApp = (appId) => {
    // Mock handler for connecting apps
    alert(`Connecting app ${appId}...`);
  };

  const handleDisconnectApp = (appId) => {
    // Mock handler for disconnecting apps
    alert(`Disconnecting app ${appId}...`);
  };

  const handleSignOutAllDevices = () => {
    if (window.confirm('Are you sure you want to sign out of all devices? You will be logged out immediately.')) {
      alert('Signed out of all devices');
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action is permanent and cannot be undone.');
    if (confirmed) {
      const doubleConfirm = window.confirm('Press OK again to permanently delete your account and all associated data.');
      if (doubleConfirm) {
        alert('Account deletion started. You will receive a confirmation email.');
      }
    }
  };

  const handleGenerateApiKey = () => {
    alert('New API key generated: sk-live-' + Math.random().toString(36).substr(2, 20).toUpperCase());
  };

  const isAdmin = userRole === 'admin';

  // Mock data for sessions
  const activeSessions = [
    { id: 1, device: 'Chrome on MacOS', location: 'San Francisco, CA', lastActive: '2 minutes ago', ipAddress: '192.168.1.100', isCurrent: true },
    { id: 2, device: 'Safari on iPhone', location: 'San Francisco, CA', lastActive: '5 hours ago', ipAddress: '192.168.1.50', isCurrent: false },
    { id: 3, device: 'Chrome on Windows', location: 'New York, NY', lastActive: '2 days ago', ipAddress: '203.45.67.89', isCurrent: false },
  ];

  // Mock data for connected apps
  const connectedApps = [
    { id: 1, name: 'Google Drive', connected: true, lastSynced: '1 hour ago', icon: '🔵' },
    { id: 2, name: 'Slack', connected: true, lastSynced: '30 minutes ago', icon: '💜' },
    { id: 3, name: 'Stripe', connected: true, lastSynced: 'Just now', icon: '🔷' },
    { id: 4, name: 'Zapier', connected: false, lastSynced: 'Never', icon: '⚡' },
  ];

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-greeting">Account <span>Settings</span></h1>
            <p className="page-subtitle">Manage your profile, preferences, security, and integrations</p>
          </div>
          <PageTabs />
        </div>
        {!isAdmin && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--warning-bg, rgba(249, 115, 22, 0.1))', border: '1px solid var(--warning, #f97316)', color: 'var(--warning, #f97316)' }}>
              <AlertCircle size={16} />
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Viewer role: Settings editing is unavailable. Switch to Admin role to make changes.</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Row 1: Profile + Quick Settings */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Extended Profile Settings */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', opacity: isAdmin ? 1 : 0.6, pointerEvents: isAdmin ? 'auto' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div className="txn-icon" style={{ background: 'var(--brand-primary)', color: 'white' }}>
                <User size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Profile Information</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {isAdmin ? 'Update your personal details' : 'View only - Admin access required'}
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User size={16} />
                  <input 
                    type="text" 
                    className="input-field" 
                    value={localProfile.name}
                    onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                    disabled={!isAdmin}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} />
                  <input 
                    type="email" 
                    className="input-field" 
                    value={localProfile.email}
                    onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
                    disabled={!isAdmin}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-with-icon">
                  <Smartphone size={16} />
                  <input 
                    type="tel" 
                    className="input-field" 
                    value={localProfile.phone}
                    onChange={(e) => setLocalProfile({ ...localProfile, phone: e.target.value })}
                    disabled={!isAdmin}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={localProfile.jobTitle}
                  onChange={(e) => setLocalProfile({ ...localProfile, jobTitle: e.target.value })}
                  disabled={!isAdmin}
                  placeholder="Your position"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={localProfile.company}
                  onChange={(e) => setLocalProfile({ ...localProfile, company: e.target.value })}
                  disabled={!isAdmin}
                  placeholder="Company name"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={localProfile.city}
                    onChange={(e) => setLocalProfile({ ...localProfile, city: e.target.value })}
                    disabled={!isAdmin}
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <select 
                    className="input-field" 
                    value={localProfile.country}
                    onChange={(e) => setLocalProfile({ ...localProfile, country: e.target.value })}
                    disabled={!isAdmin}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="India">India</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea 
                  className="input-field" 
                  value={localProfile.bio}
                  onChange={(e) => setLocalProfile({ ...localProfile, bio: e.target.value })}
                  disabled={!isAdmin}
                  placeholder="Write a brief bio"
                  rows="3"
                  style={{ fontFamily: 'inherit', resize: 'none' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ alignSelf: 'flex-start', marginTop: '10px', opacity: isAdmin ? 1 : 0.5, cursor: isAdmin ? 'pointer' : 'not-allowed' }}
                disabled={!isAdmin}
              >
                {saveSuccess ? <><Check size={16} /> Saved</> : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Preferences */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div className="txn-icon" style={{ background: 'var(--success)', color: 'white' }}>
                <Globe size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Preferences</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Customize your experience</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Dark Mode */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Moon size={16} style={{ color: 'var(--text-secondary)' }} /> Dark Mode
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Switch between light and dark themes</p>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    style={{ display: 'none' }}
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                  />
                  <div style={{
                    width: '44px',
                    height: '24px',
                    background: theme === 'dark' ? 'var(--brand-primary)' : 'var(--border-color)',
                    borderRadius: '24px',
                    position: 'relative',
                    transition: 'background 0.3s'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: theme === 'dark' ? '22px' : '2px',
                      width: '20px',
                      height: '20px',
                      background: 'white',
                      borderRadius: '50%',
                      transition: 'left 0.3s'
                    }} />
                  </div>
                </label>
              </div>

              {/* Base Currency */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <label style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Base Currency</label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Primary currency for transactions</p>
                </div>
                <select 
                  className="input-field" 
                  value={preferences.currency || 'USD'}
                  onChange={(e) => updatePreferences({ ...preferences, currency: e.target.value })}
                  style={{ appearance: 'auto', minWidth: '120px', fontSize: '0.9rem' }}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>

              {/* Language */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <label style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Language</label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Interface language</p>
                </div>
                <select 
                  className="input-field" 
                  value={preferences.language || 'English'}
                  onChange={(e) => updatePreferences({ ...preferences, language: e.target.value })}
                  style={{ appearance: 'auto', minWidth: '140px', fontSize: '0.9rem' }}
                >
                  <option value="English">English (US)</option>
                  <option value="Spanish">Español</option>
                  <option value="French">Français</option>
                  <option value="German">Deutsch</option>
                  <option value="Japanese">日本語</option>
                  <option value="Chinese">中文</option>
                </select>
              </div>

              {/* Date Format */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <label style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Date Format</label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>How dates are displayed</p>
                </div>
                <select 
                  className="input-field" 
                  value={preferences.dateFormat || 'MM/DD/YYYY'}
                  onChange={(e) => updatePreferences({ ...preferences, dateFormat: e.target.value })}
                  style={{ appearance: 'auto', minWidth: '140px', fontSize: '0.9rem' }}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              {/* Timezone */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <label style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Timezone</label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Your local timezone</p>
                </div>
                <select 
                  className="input-field" 
                  value={preferences.timezone || 'America/Los_Angeles'}
                  onChange={(e) => updatePreferences({ ...preferences, timezone: e.target.value })}
                  style={{ appearance: 'auto', minWidth: '180px', fontSize: '0.9rem' }}
                >
                  <option value="America/Los_Angeles">Pacific (PT)</option>
                  <option value="America/Denver">Mountain (MT)</option>
                  <option value="America/Chicago">Central (CT)</option>
                  <option value="America/New_York">Eastern (ET)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                </select>
              </div>

              {/* Number Format */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem' }}>Show Thousands Separator</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Use commas in large numbers</p>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    style={{ display: 'none' }}
                    checked={preferences.showThousands !== false}
                    onChange={(e) => updatePreferences({ ...preferences, showThousands: e.target.checked })}
                  />
                  <div style={{
                    width: '44px',
                    height: '24px',
                    background: preferences.showThousands !== false ? 'var(--brand-primary)' : 'var(--border-color)',
                    borderRadius: '24px',
                    position: 'relative',
                    transition: 'background 0.3s'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: preferences.showThousands !== false ? '22px' : '2px',
                      width: '20px',
                      height: '20px',
                      background: 'white',
                      borderRadius: '50%',
                      transition: 'left 0.3s'
                    }} />
                  </div>
                </label>
              </div>

              {/* Compact Mode */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem' }}>Compact Dashboard</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Condensed layout view</p>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    style={{ display: 'none' }}
                    checked={preferences.compactMode || false}
                    onChange={(e) => updatePreferences({ ...preferences, compactMode: e.target.checked })}
                  />
                  <div style={{
                    width: '44px',
                    height: '24px',
                    background: preferences.compactMode ? 'var(--brand-primary)' : 'var(--border-color)',
                    borderRadius: '24px',
                    position: 'relative',
                    transition: 'background 0.3s'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: preferences.compactMode ? '22px' : '2px',
                      width: '20px',
                      height: '20px',
                      background: 'white',
                      borderRadius: '50%',
                      transition: 'left 0.3s'
                    }} />
                  </div>
                </label>
              </div>

              <button 
                type="button"
                className="btn btn-primary" 
                onClick={handleSavePreferences}
                style={{ marginTop: '12px', fontSize: '0.9rem' }}
              >
                {preferencesSaved ? <><Check size={16} /> Preferences Saved</> : 'Save All Preferences'}
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Security + Notifications */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Security */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', opacity: isAdmin ? 1 : 0.6, pointerEvents: isAdmin ? 'auto' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div className="txn-icon" style={{ background: 'var(--danger)', color: 'white' }}>
                <Shield size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Security</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {isAdmin ? 'Keep your account safe' : 'View only'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={16} style={{ color: 'var(--text-secondary)' }} /> Two-Factor Auth
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Require a code on login</p>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: isAdmin ? 'pointer' : 'not-allowed' }}>
                  <input 
                    type="checkbox" 
                    style={{ display: 'none' }}
                    checked={security.twoFactorAuth}
                    onChange={(e) => isAdmin && updateSecurity({ ...security, twoFactorAuth: e.target.checked })}
                    disabled={!isAdmin}
                  />
                  <div style={{
                    width: '44px',
                    height: '24px',
                    background: security.twoFactorAuth ? 'var(--brand-primary)' : 'var(--border-color)',
                    borderRadius: '24px',
                    position: 'relative',
                    transition: 'background 0.3s',
                    opacity: isAdmin ? 1 : 0.5
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: security.twoFactorAuth ? '22px' : '2px',
                      width: '20px',
                      height: '20px',
                      background: 'white',
                      borderRadius: '50%',
                      transition: 'left 0.3s'
                    }} />
                  </div>
                </label>
              </div>

              <button 
                className="btn btn-outline" 
                onClick={() => alert('Password change initiated. Check your email for instructions.')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isAdmin ? 1 : 0.5, cursor: isAdmin ? 'pointer' : 'not-allowed', fontSize: '0.9rem' }}
                disabled={!isAdmin}
              >
                <Lock size={14} /> Change Password
              </button>

              <div style={{ padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Last Password Change</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>45 days ago</p>
              </div>

              <button 
                type="button"
                className="btn btn-primary" 
                onClick={handleSaveSecurity}
                style={{ marginTop: '8px', fontSize: '0.9rem', opacity: isAdmin ? 1 : 0.5 }}
                disabled={!isAdmin}
              >
                {securitySaved ? <><Check size={16} /> Security Updated</> : 'Update Security Settings'}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="txn-icon" style={{ background: 'var(--info)', color: 'white' }}>
                <Bell size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Notifications</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Manage alert preferences</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'transactionAlerts', label: 'Transaction Alerts', desc: 'Notify on new transactions' },
                { key: 'securityUpdates', label: 'Security Updates', desc: 'Important security alerts only' },
                { key: 'weeklySummary', label: 'Weekly Summary', desc: 'Get your finance summary weekly' },
                { key: 'promotions', label: 'Promotions', desc: 'Special offers and promotions' },
                { key: 'productUpdates', label: 'Product Updates', desc: 'New features and improvements' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: idx < 5 ? '1px solid var(--border-light)' : 'none' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{item.desc}</p>
                  </div>
                  <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      style={{ display: 'none' }}
                      checked={notificationSettings[item.key] || false}
                      onChange={() => handleToggleNotification(item.key)}
                    />
                    <div style={{
                      width: '40px',
                      height: '20px',
                      background: notificationSettings[item.key] ? 'var(--brand-primary)' : 'var(--border-color)',
                      borderRadius: '24px',
                      position: 'relative',
                      transition: 'background 0.3s'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '2px',
                        left: notificationSettings[item.key] ? '20px' : '2px',
                        width: '16px',
                        height: '16px',
                        background: 'white',
                        borderRadius: '50%',
                        transition: 'left 0.3s'
                      }} />
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Sessions + API Keys */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Active Sessions */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="txn-icon" style={{ background: 'var(--purple)', color: 'white' }}>
                  <DeviceIcon size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Active Sessions</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {activeSessions.filter(s => !disconnectedSessions.includes(s.id)).length} active
                  </p>
                </div>
              </div>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => setExpandedSessions(!expandedSessions)}
                style={{ fontSize: '0.8rem' }}
              >
                {expandedSessions ? 'Hide' : 'Show All'}
              </button>
            </div>

            {activeSessions.map((session) => (
              !disconnectedSessions.includes(session.id) && (
                <div key={session.id} style={{ padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {session.device}
                        {session.isCurrent && <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700, background: 'rgba(34, 197, 94, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>CURRENT</span>}
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        📍 {session.location} • {session.lastActive}
                      </p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                        IP: {session.ipAddress}
                      </p>
                    </div>
                    {!session.isCurrent && (
                      <button 
                        className="btn btn-ghost btn-icon btn-sm" 
                        style={{ color: 'var(--danger)' }} 
                        title="Sign out"
                        onClick={() => handleDisconnectSession(session.id)}
                      >
                        <LogOut size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* API Keys & Integrations */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="txn-icon" style={{ background: 'var(--warning)', color: 'white' }}>
                <Code size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>API & Integrations</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Manage API access</p>
              </div>
            </div>

            <div style={{ padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Active API Key</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
                <code style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', flex: 1, fontFamily: 'monospace', wordBreak: 'break-all' }}>sk-live-4eC39HqLyjWDarhtT881A42A</code>
                <button 
                  className="btn btn-ghost btn-icon btn-sm"
                  onClick={handleCopyApiKey}
                  title="Copy API Key"
                  style={{ color: copiedApiKey ? 'var(--success)' : 'var(--text-secondary)', flexShrink: 0 }}
                >
                  {copiedApiKey ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                Created: Jan 15, 2024 • Last used: 2 hours ago
              </p>
            </div>

            <div style={{ padding: '12px 16px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--warning)', marginBottom: '4px', textTransform: 'uppercase' }}>Pro Tip</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Keep your API key secure. Never share it in public repositories or with untrusted third parties.</p>
            </div>

            <button 
              className="btn btn-outline" 
              onClick={handleGenerateApiKey}
              style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Code size={14} /> Generate New Key
            </button>

            <button 
              className="btn btn-ghost"
              style={{ fontSize: '0.9rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Trash2 size={14} /> Revoke Current Key
            </button>
          </div>
        </div>

        {/* Row 4: Connected Apps */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div className="txn-icon" style={{ background: 'var(--cyan)', color: 'white' }}>
              <Link2 size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Connected Apps</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Manage third-party integrations ({connectedApps.filter(a => a.connected).length} connected)</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
            {connectedApps.map((app) => (
              <div key={app.id} style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>{app.icon}</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px' }}>{app.name}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: app.connected ? 'var(--success)' : 'var(--text-tertiary)', fontWeight: 500 }}>
                    {app.connected ? '✓ Connected' : 'Not connected'}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
                    {app.connected ? `Synced ${app.lastSynced}` : 'Never synced'}
                  </p>
                </div>
                <button 
                  className={`btn btn-sm ${app.connected ? 'btn-ghost' : 'btn-outline'}`}
                  style={{ marginTop: '12px', fontSize: '0.75rem', width: '100%', color: app.connected ? 'var(--danger)' : 'var(--brand-primary)' }}
                  onClick={() => app.connected ? handleDisconnectApp(app.id) : handleConnectApp(app.id)}
                >
                  {app.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '8px', padding: '12px 16px', background: 'rgba(6, 182, 212, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--cyan)', marginBottom: '4px', textTransform: 'uppercase' }}>Info</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Connect apps to automate your financial workflows and sync data across platforms.</p>
          </div>
        </div>

        {/* Row 5: Danger Zone */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderColor: 'var(--danger)', borderWidth: '2px', background: 'rgba(239, 68, 68, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="txn-icon" style={{ background: 'var(--danger)', color: 'white' }}>
              <AlertCircle size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--danger)' }}>Danger Zone</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Irreversible and destructive actions</p>
            </div>
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--danger)' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--danger)', lineHeight: '1.4' }}>
              ⚠️ Actions in this section cannot be undone. Please proceed with extreme caution.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <button 
              className="btn btn-outline" 
              onClick={handleSignOutAllDevices}
              style={{ borderColor: 'var(--danger)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}
            >
              <LogOut size={16} /> Sign Out All Devices
            </button>
            <button 
              className="btn btn-outline" 
              onClick={handleDeleteAccount}
              style={{ borderColor: 'var(--danger)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}
            >
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Wallet,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  MessageSquare,
} from 'lucide-react';
import useFinanceStore, { ROLES } from '../store/useFinanceStore';

const mainNav = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, badge: '53' },
  { id: 'insights', label: 'Analytics', icon: Lightbulb },
  { id: 'messages', label: 'Messages', icon: MessageSquare, badge: '3' },
];

const secondaryNav = [
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help Center', icon: HelpCircle },
];

export default function Sidebar() {
  const {
    activePage,
    setActivePage,
    theme,
    toggleTheme,
    userRole,
    setUserRole,
    sidebarOpen,
    closeSidebar,
  } = useFinanceStore();

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    closeSidebar();
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={closeSidebar}
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="logo-container">
          <div className="logo-icon">Z</div>
          <div>
            <div className="logo-text">Zorvyn</div>
            <div className="logo-subtitle">Finance</div>
          </div>
        </div>

        {/* Main Nav */}
        <nav>
          <div className="nav-section-label">Main Menu</div>
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={19} />
                {item.label}
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            );
          })}

          <div className="nav-section-label">General</div>
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={19} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Role Switcher */}
          <div className="sidebar-role-switcher">
            <label>Access Role</label>
            <select
              className="role-select"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              <option value={ROLES.ADMIN}>Admin</option>
              <option value={ROLES.VIEWER}>Viewer</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </aside>
    </>
  );
}

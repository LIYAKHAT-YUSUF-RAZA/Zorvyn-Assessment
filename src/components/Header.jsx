import { useState, useEffect, useRef } from 'react';
import { Search, Bell, MessageSquare, ChevronDown, User, Settings, LogOut, Check, X, FileText, HelpCircle, LayoutDashboard, Wallet, ArrowLeftRight, LineChart, Receipt } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

const PAGES = [
  { id: 'dashboard', name: 'Dashboard Overview', icon: <LayoutDashboard size={16} /> },
  { id: 'wallet', name: 'Wallet & Cards', icon: <Wallet size={16} /> },
  { id: 'transactions', name: 'Transactions History', icon: <ArrowLeftRight size={16} /> },
  { id: 'insights', name: 'Analytics & Insights', icon: <LineChart size={16} /> },
  { id: 'report', name: 'Financial Reports', icon: <FileText size={16} /> },
  { id: 'settings', name: 'Account Settings', icon: <Settings size={16} /> },
  { id: 'help', name: 'Help & Support', icon: <HelpCircle size={16} /> }
];

const MOCK_MESSAGES = [
  "Hey, did you get the transfer I sent earlier?",
  "Thanks for covering lunch today!",
  "Can you review the latest invoice when you have time?",
  "Just sent you a money request for the concert tickets.",
  "Your wallet has been verified!"
];

export default function Header() {
  const { 
    transactions, 
    contacts, 
    userRole, 
    setUserRole, 
    profile, 
    activePage, 
    setActivePage, 
    setSearchQuery,
    openModal,
    setActiveChat
  } = useFinanceStore();

  const [localSearch, setLocalSearch] = useState('');
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showMessagesMenu, setShowMessagesMenu] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Focus search on Cmd+F / Ctrl+F
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault(); 
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowSearchMenu(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Search Submission natively
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      setShowSearchMenu(false);
      setSearchQuery(localSearch);
      if (activePage !== 'transactions') {
        setActivePage('transactions');
      }
      searchInputRef.current?.blur();
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const closeMenus = (e) => {
      setShowProfileMenu(false);
      setShowNotifMenu(false);
      setShowMessagesMenu(false);
      // Only close search if we clicked outside the search container
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchMenu(false);
      }
    };
    document.addEventListener('click', closeMenus);
    return () => document.removeEventListener('click', closeMenus);
  }, []);

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
    setShowSearchMenu(e.target.value.trim().length > 0);
  };

  const getInitials = (name) => {
    if (!name) return 'JB';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const displayName = profile?.name || 'Jaylon Baptista';

  // Derived Search Results
  const query = localSearch.toLowerCase().trim();
  const searchActive = query.length > 0 && showSearchMenu;
  
  const filteredPages = query ? PAGES.filter(p => p.name.toLowerCase().includes(query)) : [];
  const filteredTransactions = query ? transactions.filter(t => 
    t.description.toLowerCase().includes(query) || 
    t.category.toLowerCase().includes(query)
  ).slice(0, 4) : [];
  const filteredContacts = query ? contacts.filter(c => c.name.toLowerCase().includes(query)).slice(0, 3) : [];

  return (
    <header className="top-header">
      <div className="header-search" ref={searchContainerRef} style={{ position: 'relative' }}>
        <Search />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search transactions, categories..."
          id="global-search"
          value={localSearch}
          onChange={handleSearchChange}
          onFocus={() => { if (localSearch.trim().length > 0) setShowSearchMenu(true); }}
          onKeyDown={handleSearchSubmit}
        />
        {localSearch ? (
          <span 
            className="search-shortcut" 
            style={{ cursor: 'pointer', background: 'transparent', border: 'none', right: '10px' }}
            onClick={() => { setLocalSearch(''); setShowSearchMenu(false); searchInputRef.current?.focus(); }}
          >
            <X size={14} />
          </span>
        ) : (
          <span className="search-shortcut">⌘F</span>
        )}

        {/* Global Search Command Palette */}
        {searchActive && (
          <div className="dropdown-menu" style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '450px',
            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-xl)', borderRadius: 'var(--radius-lg)', zIndex: 200,
            maxHeight: '400px', overflowY: 'auto'
          }}>
            {filteredPages.length === 0 && filteredTransactions.length === 0 && filteredContacts.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                No results found for "{localSearch}"
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                
                {/* Pages */}
                {filteredPages.length > 0 && (
                  <div style={{ borderBottom: '1px solid var(--border-color)', padding: '8px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', padding: '4px 8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pages</div>
                    {filteredPages.map(page => (
                      <div 
                        key={page.id}
                        onClick={() => {
                          setActivePage(page.id);
                          setShowSearchMenu(false);
                          setLocalSearch('');
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-primary)', transition: 'background 0.2s', fontSize: '0.875rem' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ color: 'var(--text-secondary)' }}>{page.icon}</div>
                        {page.name}
                      </div>
                    ))}
                  </div>
                )}

                {/* Contacts */}
                {filteredContacts.length > 0 && (
                  <div style={{ borderBottom: '1px solid var(--border-color)', padding: '8px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', padding: '4px 8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Contacts</div>
                    {filteredContacts.map(contact => (
                      <div 
                        key={contact.id}
                        onClick={() => {
                          setActivePage('wallet'); // Route to wallet where contacts usually interact
                          setShowSearchMenu(false);
                          setLocalSearch('');
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-primary)', transition: 'background 0.2s', fontSize: '0.875rem' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: contact.color || 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                          {contact.initials || getInitials(contact.name)}
                        </div>
                        <span>{contact.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>Contact</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Transactions */}
                {filteredTransactions.length > 0 && (
                  <div style={{ padding: '8px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', padding: '4px 8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Transactions</div>
                    {filteredTransactions.map(txn => (
                      <div 
                        key={txn.id}
                        onClick={() => {
                          setShowSearchMenu(false);
                          setLocalSearch('');
                          openModal(txn); // Open transaction modal directly!
                        }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'background 0.2s', fontSize: '0.875rem' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Receipt size={16} style={{ color: 'var(--text-secondary)' }} />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{txn.description}</span>
                            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{txn.date} • {txn.category}</span>
                          </div>
                        </div>
                        <span style={{ fontWeight: 600, color: txn.type === 'income' ? 'var(--success)' : 'var(--text-primary)' }}>
                          {txn.type === 'income' ? '+' : '-'}${Math.abs(txn.amount).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div 
                      onClick={() => {
                        setShowSearchMenu(false);
                        setSearchQuery(localSearch);
                        setActivePage('transactions');
                      }}
                      style={{ padding: '10px', textAlign: 'center', color: 'var(--accent)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500, marginTop: '4px' }}
                    >
                      View all matching transactions &rarr;
                    </div>
                  </div>
                )}
                
              </div>
            )}
          </div>
        )}
      </div>

      <div className="header-actions">
        
        <div style={{ position: 'relative' }}>
          <button 
            className="header-icon-btn" 
            title="Messages" 
            onClick={(e) => {
              e.stopPropagation();
              setShowMessagesMenu(!showMessagesMenu);
              setShowNotifMenu(false);
              setShowProfileMenu(false);
              setShowSearchMenu(false);
            }}
          >
            <MessageSquare size={19} />
          </button>

          {/* Messages Dropdown */}
          {showMessagesMenu && (
            <div style={{ 
              position: 'absolute', right: 0, top: 'calc(100% + 10px)', 
              width: '340px', background: 'var(--bg-secondary)', 
              boxShadow: 'var(--shadow-xl)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)', zIndex: 100,
              padding: '12px', maxHeight: '400px', overflowY: 'auto'
            }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>Messages</h4>
                <button onClick={() => { setActivePage('messages'); setShowMessagesMenu(false); setTimeout(() => document.getElementById('chat-search-input')?.focus(), 100); }} style={{ border: 'none', background: 'none', color: 'var(--accent)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}>New Message</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {contacts.slice(0, 4).map((contact, i) => (
                  <div key={contact.id || i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--bg-hover)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'} onClick={() => { setActiveChat(contact.id); setActivePage('messages'); setShowMessagesMenu(false); }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: contact.color || 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                        {contact.initials || getInitials(contact.name)}
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: 'var(--success)', border: '2px solid var(--bg-secondary)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{contact.name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{Math.max(1, i * 2)}h ago</span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {MOCK_MESSAGES[i % MOCK_MESSAGES.length]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                 <button onClick={() => { setActivePage('messages'); setShowMessagesMenu(false); }} style={{ border: 'none', background: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}>View all messages</button>
              </div>
            </div>
          )}
        </div>
        
        <div style={{ position: 'relative' }}>
          <button 
            className="header-icon-btn" 
            title="Notifications"
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifMenu(!showNotifMenu);
              setShowMessagesMenu(false);
              setShowProfileMenu(false);
              setShowSearchMenu(false);
            }}
          >
            <Bell size={19} />
            <span className="notif-dot" />
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifMenu && (
             <div style={{ 
              position: 'absolute', right: 0, top: 'calc(100% + 10px)', 
              width: '320px', background: 'var(--bg-secondary)', 
              boxShadow: 'var(--shadow-xl)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)', zIndex: 100,
              padding: '12px'
            }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>Notifications</h4>
                <button style={{ border: 'none', background: 'none', color: 'var(--accent)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}>Mark all read</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-bg)', fontSize: '0.85rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Security Alert</strong><br/>
                  <span style={{ color: 'var(--text-secondary)' }}>New login from Chrome on macOS detected 5 minutes ago.</span>
                </div>
                <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='var(--bg-hover)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'} onClick={() => setShowNotifMenu(false)}>
                  <strong style={{ color: 'var(--text-primary)' }}>Transfer Complete</strong><br/>
                  <span style={{ color: 'var(--text-secondary)' }}>Your transfer of $500 to Ally High-Yield has settled.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <div 
            className="user-profile" 
            onClick={(e) => {
              e.stopPropagation();
              setShowProfileMenu(!showProfileMenu);
              setShowNotifMenu(false);
              setShowMessagesMenu(false);
              setShowSearchMenu(false);
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="user-avatar">{getInitials(displayName)}</div>
            <div className="user-info">
              <span className="user-name">{displayName}</span>
              <span className="user-role">
                {userRole === 'admin' ? 'Admin' : 'Viewer'}
              </span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div style={{ 
              position: 'absolute', right: 0, top: 'calc(100% + 10px)', 
              width: '220px', background: 'var(--bg-secondary)', 
              boxShadow: 'var(--shadow-xl)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)', zIndex: 100,
              display: 'flex', flexDirection: 'column', padding: '8px'
            }} onClick={e => e.stopPropagation()}>
              
              <button 
                style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', background: 'transparent', transition: 'all 0.2s', fontSize: '0.875rem' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => { setActivePage('settings'); setShowProfileMenu(false); }}
              >
                <User size={16} style={{ color: 'var(--text-secondary)' }} /> My Profile
              </button>
              
              <button 
                style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', background: 'transparent', transition: 'all 0.2s', fontSize: '0.875rem' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => { setActivePage('settings'); setShowProfileMenu(false); }}
              >
                <Settings size={16} style={{ color: 'var(--text-secondary)' }} /> Account Settings
              </button>

              <div style={{ height: '1px', background: 'var(--border-color)', margin: '8px 0' }} />

              <div style={{ padding: '4px 12px', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>ROLE SIMULATION</div>
              
              <button 
                style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', background: 'transparent', transition: 'all 0.2s', fontSize: '0.875rem' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => { setUserRole('admin'); setShowProfileMenu(false); }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Admin
                </div>
                {userRole === 'admin' && <Check size={16} style={{ color: 'var(--success)' }} />}
              </button>

              <button 
                style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', background: 'transparent', transition: 'all 0.2s', fontSize: '0.875rem' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => { setUserRole('viewer'); setShowProfileMenu(false); }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   Viewer
                </div>
                {userRole === 'viewer' && <Check size={16} style={{ color: 'var(--success)' }} />}
              </button>

              <div style={{ height: '1px', background: 'var(--border-color)', margin: '8px 0' }} />

              <button 
                style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', color: 'var(--danger)', background: 'transparent', transition: 'all 0.2s', fontSize: '0.875rem' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--danger-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => setShowProfileMenu(false)}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

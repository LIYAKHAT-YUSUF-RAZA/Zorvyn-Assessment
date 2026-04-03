import useFinanceStore from '../store/useFinanceStore';

export default function PageTabs() {
  const { setActivePage, activePage } = useFinanceStore();

  const tabs = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'wallet', label: 'Wallet' },
    { id: 'insights', label: 'Analytics' },
    { id: 'transactions', label: 'Transaction' },
    { id: 'settings', label: 'Settings' },
    { id: 'report', label: 'Report' },
  ];

  return (
    <div className="page-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`page-tab ${activePage === tab.id ? 'active' : ''}`}
          onClick={() => setActivePage(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

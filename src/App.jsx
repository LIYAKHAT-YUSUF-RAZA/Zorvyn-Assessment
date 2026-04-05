import { useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TransactionModal from './components/TransactionModal';
import SendMoneyModal from './components/SendMoneyModal';
import RequestMoneyModal from './components/RequestMoneyModal';
import CardDetailModal from './components/CardDetailModal';
import CreateCardModal from './components/CreateCardModal';
import ConnectBankModal from './components/ConnectBankModal';
import RetirementModal from './components/RetirementModal';
import SkeletonLoader from './components/SkeletonLoader';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';
import useFinanceStore from './store/useFinanceStore';

import WalletPage from './pages/WalletPage';
import SettingsPage from './pages/SettingsPage';
import ReportPage from './pages/ReportPage';
import HelpPage from './pages/HelpPage';
import MessagesPage from './pages/MessagesPage';

function App() {
  const {
    activePage,
    theme,
    isLoading,
    setIsLoading,
    toggleSidebar,
  } = useFinanceStore();

  // Initialize theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="page-container">
          <div style={{ marginBottom: 24 }}>
            <div className="skeleton" style={{ width: 220, height: 32, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: 300, height: 16 }} />
          </div>
          <SkeletonLoader type="summary" />
          <SkeletonLoader type="charts" />
        </div>
      );
    }

    switch (activePage) {
      case 'dashboard':
        return <div className="page-container"><DashboardPage /></div>;
      case 'transactions':
        return <div className="page-container"><TransactionsPage /></div>;
      case 'insights':
        return <div className="page-container"><InsightsPage /></div>;
      case 'wallet':
        return <div className="page-container"><WalletPage /></div>;
      case 'settings':
        return <div className="page-container"><SettingsPage /></div>;
      case 'report':
        return <div className="page-container"><ReportPage /></div>;
      case 'help':
        return <div className="page-container"><HelpPage /></div>;
      case 'messages':
        return <div className="page-container-full"><MessagesPage /></div>;
      default:
        return <div className="page-container"><DashboardPage /></div>;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />
        {renderPage()}
      </main>

      {/* Mobile Menu FAB */}
      <button
        className="mobile-menu-btn"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <Menu size={22} />
      </button>

      <TransactionModal />
      <SendMoneyModal />
      <RequestMoneyModal />
      <CardDetailModal />
      <CreateCardModal />
      <ConnectBankModal />
      <RetirementModal />
    </div>
  );
}

export default App;


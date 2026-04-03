import SummaryCards from '../components/SummaryCards';
import BalanceChart from '../components/BalanceChart';
import SpendingPieChart from '../components/SpendingPieChart';
import RecentTransactions from '../components/RecentTransactions';
import PageTabs from '../components/PageTabs';

export default function DashboardPage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-greeting">
              {greeting}, <span>Jaylon</span> 👋
            </h1>
            <p className="page-subtitle">This is your finance report</p>
          </div>
          <PageTabs />
        </div>
      </div>

      <SummaryCards />

      <div className="charts-section">
        <BalanceChart />
        <SpendingPieChart />
      </div>

      <RecentTransactions />
    </div>
  );
}

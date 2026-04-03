import TransactionTable from '../components/TransactionTable';
import useFinanceStore from '../store/useFinanceStore';
import PageTabs from '../components/PageTabs';

export default function TransactionsPage() {
  const { userRole } = useFinanceStore();

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-greeting">Transactions</h1>
            <p className="page-subtitle">Manage and review all your financial transactions</p>
          </div>
          <PageTabs />
        </div>
        <div style={{ marginTop: 12 }}>
          <span className={`badge ${userRole === 'admin' ? 'badge-income' : 'badge-category'}`} style={{ fontSize: '0.75rem', padding: '5px 14px' }}>
            {userRole === 'admin' ? '🔓 Admin Mode' : '🔒 View Only'}
          </span>
        </div>
      </div>
      <TransactionTable />
    </div>
  );
}

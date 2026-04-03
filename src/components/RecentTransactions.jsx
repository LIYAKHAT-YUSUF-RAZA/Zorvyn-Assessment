import { Search, Filter, ArrowUpRight } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

const categoryEmojis = {
  'Salary': '💰',
  'Freelance': '💻',
  'Investments': '📈',
  'Food & Dining': '🍕',
  'Transport': '🚗',
  'Shopping': '🛍️',
  'Bills & Utilities': '⚡',
  'Entertainment': '🎬',
  'Healthcare': '🏥',
  'Travel': '✈️',
  'Education': '📚',
  'Rent': '🏠',
};

const categoryBgs = {
  'Salary': '#eef2ff',
  'Freelance': '#f5f3ff',
  'Investments': '#ecfdf5',
  'Food & Dining': '#fff7ed',
  'Transport': '#fefce8',
  'Shopping': '#fdf2f8',
  'Bills & Utilities': '#f1f5f9',
  'Entertainment': '#faf5ff',
  'Healthcare': '#ecfdf5',
  'Travel': '#eff6ff',
  'Education': '#f0fdfa',
  'Rent': '#fef2f2',
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function RecentTransactions() {
  const { transactions, setActivePage } = useFinanceStore();

  // Show latest 8 transactions
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  return (
    <div className="card animate-in" id="recent-transactions" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="txn-header" style={{ padding: '20px 24px 0' }}>
        <div>
          <h3>Transaction and Invoices</h3>
          <p>Stay updated on recent financial activities</p>
        </div>
        <div className="txn-header-actions">
          <button className="btn btn-ghost btn-sm">
            <Search size={14} /> Search
          </button>
          <button className="btn btn-ghost btn-sm">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      <div className="table-container" style={{ padding: '12px 0 0' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: 24 }}>Transaction</th>
              <th>Date</th>
              <th>Amount</th>
              <th style={{ paddingRight: 24 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((txn) => (
              <tr key={txn.id}>
                <td style={{ paddingLeft: 24 }}>
                  <div className="txn-item-name">
                    <div className="txn-icon" style={{
                      background: categoryBgs[txn.category] || '#f1f5f9',
                      fontSize: '1.125rem',
                    }}>
                      {categoryEmojis[txn.category] || '💱'}
                    </div>
                    <div>
                      <div className="txn-desc">{txn.description}</div>
                      <div className="txn-cat">{txn.category}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                  {formatDate(txn.date)}
                </td>
                <td style={{
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: '0.875rem',
                  color: txn.type === 'income' ? 'var(--success)' : 'var(--text-primary)',
                }}>
                  {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                </td>
                <td style={{ paddingRight: 24 }}>
                  <span className={`badge ${txn.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                    {txn.type === 'income' ? 'Received' : 'Paid'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        padding: '12px 24px 16px',
        textAlign: 'center',
      }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setActivePage('transactions')}
          style={{ color: 'var(--accent)', fontWeight: 600, gap: 4 }}
        >
          View all transactions <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}

import { Search, ArrowUpDown, ChevronUp, ChevronDown, Pencil, Trash2, Plus, FileX } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

const categoryEmojis = {
  'Salary': '💰', 'Freelance': '💻', 'Investments': '📈',
  'Food & Dining': '🍕', 'Transport': '🚗', 'Shopping': '🛍️',
  'Bills & Utilities': '⚡', 'Entertainment': '🎬', 'Healthcare': '🏥',
  'Travel': '✈️', 'Education': '📚', 'Rent': '🏠',
};

const categoryBgs = {
  'Salary': '#eef2ff', 'Freelance': '#f5f3ff', 'Investments': '#ecfdf5',
  'Food & Dining': '#fff7ed', 'Transport': '#fefce8', 'Shopping': '#fdf2f8',
  'Bills & Utilities': '#f1f5f9', 'Entertainment': '#faf5ff', 'Healthcare': '#ecfdf5',
  'Travel': '#eff6ff', 'Education': '#f0fdfa', 'Rent': '#fef2f2',
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);

const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

function SortIndicator({ field, currentField, direction }) {
  if (currentField !== field) return <ArrowUpDown size={13} className="sort-icon" />;
  return direction === 'asc'
    ? <ChevronUp size={13} style={{ opacity: 1, color: 'var(--accent)' }} />
    : <ChevronDown size={13} style={{ opacity: 1, color: 'var(--accent)' }} />;
}

export default function TransactionTable() {
  const {
    getFilteredTransactions, searchQuery, setSearchQuery,
    filterType, setFilterType, sortField, sortDirection, setSorting,
    isAdmin, openModal, deleteTransaction,
  } = useFinanceStore();

  const transactions = getFilteredTransactions();
  const adminMode = isAdmin();

  return (
    <div className="page-enter">
      <div className="toolbar">
        <div className="search-wrapper">
          <Search />
          <input
            id="transaction-search"
            type="text"
            className="input-field"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="tab-bar">
          {['all', 'income', 'expense'].map((type) => (
            <button
              key={type}
              className={`tab-item ${filterType === type ? 'active' : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {adminMode && (
          <button id="add-transaction-btn" className="btn btn-primary" onClick={() => openModal(null)}>
            <Plus size={15} /> Add Transaction
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {transactions.length === 0 ? (
          <div className="empty-state">
            <FileX />
            <h3>No transactions found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => setSorting('date')} style={{ paddingLeft: 20 }}>
                    Date <SortIndicator field="date" currentField={sortField} direction={sortDirection} />
                  </th>
                  <th>Transaction</th>
                  <th onClick={() => setSorting('category')}>
                    Category <SortIndicator field="category" currentField={sortField} direction={sortDirection} />
                  </th>
                  <th onClick={() => setSorting('amount')}>
                    Amount <SortIndicator field="amount" currentField={sortField} direction={sortDirection} />
                  </th>
                  <th>Status</th>
                  {adminMode && <th style={{ textAlign: 'center' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                      {formatDate(txn.date)}
                    </td>
                    <td>
                      <div className="txn-item-name">
                        <div className="txn-icon" style={{
                          background: categoryBgs[txn.category] || '#f1f5f9',
                          fontSize: '1rem',
                        }}>
                          {categoryEmojis[txn.category] || '💱'}
                        </div>
                        <div>
                          <div className="txn-desc">{txn.description}</div>
                          <div className="txn-cat">{txn.category}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-category">{txn.category}</span>
                    </td>
                    <td style={{
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                      color: txn.type === 'income' ? 'var(--success)' : 'var(--text-primary)',
                    }}>
                      {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </td>
                    <td>
                      <span className={`badge ${txn.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                        {txn.type === 'income' ? 'Received' : 'Paid'}
                      </span>
                    </td>
                    {adminMode && (
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2px' }}>
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openModal(txn)} title="Edit">
                            <Pencil size={13} />
                          </button>
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => deleteTransaction(txn.id)} title="Delete" style={{ color: 'var(--danger)' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ marginTop: 10, fontSize: '0.8125rem', color: 'var(--text-tertiary)', textAlign: 'right' }}>
        Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

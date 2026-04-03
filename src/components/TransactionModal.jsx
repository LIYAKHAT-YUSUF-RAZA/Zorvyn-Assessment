import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';
import { CATEGORIES, TRANSACTION_TYPE } from '../data/transactions';

const categoryOptions = Object.values(CATEGORIES);

export default function TransactionModal() {
  const {
    modalOpen,
    editingTransaction,
    closeModal,
    addTransaction,
    updateTransaction,
    canEditTransactions,
    canCreateTransactions,
    userRole,
  } = useFinanceStore();

  const [formData, setFormData] = useState({
    date: '',
    description: '',
    amount: '',
    category: categoryOptions[0],
    type: TRANSACTION_TYPE.EXPENSE,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        date: editingTransaction.date,
        description: editingTransaction.description,
        amount: editingTransaction.amount.toString(),
        category: editingTransaction.category,
        type: editingTransaction.type,
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        category: categoryOptions[0],
        type: TRANSACTION_TYPE.EXPENSE,
      });
    }
    setErrors({});
  }, [editingTransaction, modalOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Enter a valid amount';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check permissions
    if (editingTransaction && !canEditTransactions()) {
      return;
    }
    if (!editingTransaction && !canCreateTransactions()) {
      return;
    }
    
    if (!validate()) return;

    const transaction = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transaction);
    } else {
      addTransaction(transaction);
    }

    closeModal();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!modalOpen) return null;

  const isEditing = !!editingTransaction;
  const canPerformAction = isEditing ? canEditTransactions() : canCreateTransactions();
  const isViewerRestricted = userRole === 'viewer' && !canPerformAction;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={closeModal}>
            <X size={18} />
          </button>
        </div>

        {isViewerRestricted && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--danger)', marginBottom: '20px' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Viewer role cannot edit transactions. Switch to Admin to make changes.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ opacity: isViewerRestricted ? 0.6 : 1, pointerEvents: isViewerRestricted ? 'none' : 'auto' }}>
          {/* Type Toggle */}
          <div className="form-group">
            <label>Type</label>
            <div className="tab-bar" style={{ width: '100%' }}>
              <button
                type="button"
                className={`tab-item ${formData.type === TRANSACTION_TYPE.INCOME ? 'active' : ''}`}
                style={{ flex: 1 }}
                onClick={() => handleChange('type', TRANSACTION_TYPE.INCOME)}
              >
                Income
              </button>
              <button
                type="button"
                className={`tab-item ${formData.type === TRANSACTION_TYPE.EXPENSE ? 'active' : ''}`}
                style={{ flex: 1 }}
                onClick={() => handleChange('type', TRANSACTION_TYPE.EXPENSE)}
              >
                Expense
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="txn-description">Description</label>
            <input
              id="txn-description"
              type="text"
              className="input-field"
              placeholder="Enter description..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
            {errors.description && (
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-danger)', marginTop: '4px', display: 'block' }}>
                {errors.description}
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label htmlFor="txn-amount">Amount ($)</label>
              <input
                id="txn-amount"
                type="number"
                className="input-field"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
              />
              {errors.amount && (
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-danger)', marginTop: '4px', display: 'block' }}>
                  {errors.amount}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="txn-date">Date</label>
              <input
                id="txn-date"
                type="date"
                className="input-field"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
              {errors.date && (
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-danger)', marginTop: '4px', display: 'block' }}>
                  {errors.date}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="txn-category">Category</label>
            <select
              id="txn-category"
              className="select-field"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {editingTransaction ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

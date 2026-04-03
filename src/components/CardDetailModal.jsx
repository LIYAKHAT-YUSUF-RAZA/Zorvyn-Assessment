import { useState } from 'react';
import { X, Copy, Check, Shield, ShieldOff, Trash2, Eye, EyeOff, CreditCard, TrendingUp, Lock } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

export default function CardDetailModal() {
  const {
    cardDetailModalOpen,
    closeCardDetail,
    selectedCard,
    toggleFreezeCard,
    removeCard,
  } = useFinanceStore();

  const [copiedField, setCopiedField] = useState('');
  const [showNumber, setShowNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!cardDetailModalOpen || !selectedCard) return null;

  const card = selectedCard;
  const spentPercent = card.limit > 0 ? Math.round((card.spent / card.limit) * 100) : 0;

  const handleCopy = (text, field) => {
    navigator.clipboard?.writeText(text.replace(/\s/g, ''));
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleFreeze = () => {
    toggleFreezeCard(card.id);
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    removeCard(card.id);
    closeCardDetail();
  };

  const maskedNumber = showNumber
    ? card.cardNumber
    : `•••• •••• •••• ${card.lastFour}`;

  return (
    <div className="modal-overlay" onClick={closeCardDetail}>
      <div className="money-modal card-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="money-modal-header">
          <div>
            <h2 className="money-modal-title">Card Details</h2>
            <p className="money-modal-subtitle">{card.brand} • {card.type === 'virtual' ? 'Virtual Card' : 'Physical Card'}</p>
          </div>
          <button className="money-modal-close" onClick={closeCardDetail}>
            <X size={20} />
          </button>
        </div>

        <div className="money-modal-body">
          {/* Card Preview */}
          <div className="card-detail-preview" style={{ background: card.gradient }}>
            {card.frozen && (
              <div className="card-frozen-overlay">
                <Lock size={32} />
                <span>Card Frozen</span>
              </div>
            )}
            <div className="card-preview-decor-1" />
            <div className="card-preview-decor-2" />
            <div className="card-preview-top">
              <span className="card-preview-brand">{card.brand}</span>
              <CreditCard size={24} style={{ opacity: 0.8 }} />
            </div>
            <div className="card-preview-number">{maskedNumber}</div>
            <div className="card-preview-bottom">
              <div>
                <div className="card-preview-label">Card Holder</div>
                <div className="card-preview-value">{card.holder}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="card-preview-label">Expires</div>
                <div className="card-preview-value">{card.expiry}</div>
              </div>
            </div>
          </div>

          {/* Card Info Rows */}
          <div className="card-info-section">
            <div className="card-info-row">
              <span className="card-info-label">Card Number</span>
              <div className="card-info-actions">
                <button className="card-info-toggle" onClick={() => setShowNumber(!showNumber)}>
                  {showNumber ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  className="card-info-copy"
                  onClick={() => handleCopy(card.cardNumber, 'number')}
                >
                  {copiedField === 'number' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedField === 'number' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="card-info-row">
              <span className="card-info-label">CVV</span>
              <div className="card-info-actions">
                <span className="card-info-value">{showCvv ? card.cvv : '•••'}</span>
                <button className="card-info-toggle" onClick={() => setShowCvv(!showCvv)}>
                  {showCvv ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="card-info-row">
              <span className="card-info-label">Expiry Date</span>
              <span className="card-info-value">{card.expiry}</span>
            </div>

            <div className="card-info-row">
              <span className="card-info-label">Card Type</span>
              <span className="card-info-value" style={{ textTransform: 'capitalize' }}>
                {card.type}
              </span>
            </div>
          </div>

          {/* Spending Progress */}
          <div className="card-spending-section">
            <div className="card-spending-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} style={{ color: 'var(--accent)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                  Spending
                </span>
              </div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                ${card.spent.toLocaleString()} / ${card.limit.toLocaleString()}
              </span>
            </div>
            <div className="card-spending-bar">
              <div
                className="card-spending-fill"
                style={{
                  width: `${spentPercent}%`,
                  background: spentPercent > 80 ? 'var(--danger)' : spentPercent > 50 ? 'var(--warning)' : 'var(--accent)',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{spentPercent}% used</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                ${(card.limit - card.spent).toLocaleString()} remaining
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="card-detail-actions">
            <button
              className={`card-action-btn ${card.frozen ? 'unfreeze' : 'freeze'}`}
              onClick={handleFreeze}
            >
              {card.frozen ? <ShieldOff size={18} /> : <Shield size={18} />}
              {card.frozen ? 'Unfreeze Card' : 'Freeze Card'}
            </button>

            <button
              className={`card-action-btn delete ${confirmDelete ? 'confirm' : ''}`}
              onClick={handleDelete}
            >
              <Trash2 size={18} />
              {confirmDelete ? 'Confirm Delete?' : 'Remove Card'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

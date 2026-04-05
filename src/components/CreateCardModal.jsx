import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check, CreditCard, Sparkles, Shield, Palette, AlertCircle } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

const CARD_STYLES = [
  { id: 'midnight', name: 'Midnight', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'dark' },
  { id: 'emerald', name: 'Emerald', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'green' },
  { id: 'ocean', name: 'Ocean', gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: 'blue' },
  { id: 'sunset', name: 'Sunset', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: 'orange' },
  { id: 'violet', name: 'Violet', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'purple' },
  { id: 'rose', name: 'Rose', gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', color: 'rose' },
];

const SPENDING_LIMITS = [
  { value: 5000, label: '$5,000' },
  { value: 10000, label: '$10,000' },
  { value: 15000, label: '$15,000' },
  { value: 25000, label: '$25,000' },
  { value: 50000, label: '$50,000' },
];

export default function CreateCardModal() {
  const {
    createCardModalOpen,
    closeCreateCardModal,
    addCard,
    canCreateCards,
  } = useFinanceStore();

  const [step, setStep] = useState(1);
  const [cardName, setCardName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(CARD_STYLES[0]);
  const [spendingLimit, setSpendingLimit] = useState(10000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdCard, setCreatedCard] = useState(null);

  useEffect(() => {
    if (createCardModalOpen) {
      setStep(1);
      setCardName('');
      setSelectedStyle(CARD_STYLES[0]);
      setSpendingLimit(10000);
      setIsProcessing(false);
      setIsSuccess(false);
      setCreatedCard(null);
    }
  }, [createCardModalOpen]);

  const handleGoToStyle = () => {
    if (!cardName.trim()) return;
    setStep(2);
  };

  const handleGoToReview = () => {
    setStep(3);
  };

  const handleCreateCard = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newCard = addCard({
        brand: cardName.trim().toUpperCase(),
        type: 'virtual',
        holder: 'Liyakhat Yusuf Raza',
        expiry: (() => {
          const d = new Date();
          d.setFullYear(d.getFullYear() + 3);
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const y = String(d.getFullYear()).slice(-2);
          return `${m}/${y}`;
        })(),
        balance: 0,
        limit: spendingLimit,
        color: selectedStyle.color,
        gradient: selectedStyle.gradient,
      });
      setCreatedCard(newCard);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1800);
  };

  if (!createCardModalOpen) return null;

  // Check permissions
  const hasPermission = canCreateCards();
  if (createCardModalOpen && !hasPermission) {
    return (
      <div className="modal-overlay" onClick={closeCreateCardModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Get Virtual Card</h2>
            <button className="btn btn-ghost btn-icon" onClick={closeCreateCardModal}>
              <X size={18} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', margin: '0 auto', alignItems: 'center' }}>
              <AlertCircle size={32} color="var(--danger)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Access Restricted</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your Viewer role cannot create cards. Please switch to Admin role to proceed.</p>
            </div>
            <button className="btn btn-primary" onClick={closeCreateCardModal} style={{ marginTop: '12px' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={closeCreateCardModal}>
      <div className="money-modal create-card-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        {!isSuccess && (
          <div className="money-modal-header">
            <div className="money-modal-header-left">
              {step > 1 && (
                <button className="money-modal-back" onClick={() => setStep(step - 1)}>
                  <ArrowLeft size={18} />
                </button>
              )}
              <div>
                <h2 className="money-modal-title">Get Virtual Card</h2>
                <p className="money-modal-subtitle">
                  {step === 1 && 'Name your card'}
                  {step === 2 && 'Choose a design'}
                  {step === 3 && 'Review & create'}
                </p>
              </div>
            </div>
            <button className="money-modal-close" onClick={closeCreateCardModal}>
              <X size={20} />
            </button>
          </div>
        )}

        {/* Step Indicator */}
        {!isSuccess && (
          <div className="step-indicator">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`step-dot ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`}>
                {s < step ? <Check size={10} /> : s}
              </div>
            ))}
            <div className="step-line">
              <div className="step-line-fill" style={{ width: `${((step - 1) / 2) * 100}%` }} />
            </div>
          </div>
        )}

        {/* Step 1: Name & Limit */}
        {step === 1 && (
          <div className="money-modal-body step-transition">
            <div className="create-card-intro">
              <div className="create-card-intro-icon">
                <Sparkles size={24} />
              </div>
              <p>Create a virtual card for secure online payments. Your card will be ready to use instantly.</p>
            </div>

            <div className="form-group">
              <label>Card Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Shopping, Subscriptions, Travel..."
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                autoFocus
                maxLength={20}
              />
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                This name will appear on your card
              </span>
            </div>

            <div className="form-group">
              <label>Spending Limit</label>
              <div className="limit-grid">
                {SPENDING_LIMITS.map((l) => (
                  <button
                    key={l.value}
                    className={`limit-option ${spendingLimit === l.value ? 'selected' : ''}`}
                    onClick={() => setSpendingLimit(l.value)}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-features">
              <div className="card-feature-item">
                <Shield size={16} style={{ color: 'var(--accent)' }} />
                <span>Instant freeze & unfreeze</span>
              </div>
              <div className="card-feature-item">
                <CreditCard size={16} style={{ color: 'var(--accent)' }} />
                <span>Works everywhere Visa is accepted</span>
              </div>
              <div className="card-feature-item">
                <Sparkles size={16} style={{ color: 'var(--accent)' }} />
                <span>2% cashback on all purchases</span>
              </div>
            </div>

            <button
              className="btn btn-primary money-modal-continue"
              onClick={handleGoToStyle}
              disabled={!cardName.trim()}
              style={{ opacity: !cardName.trim() ? 0.5 : 1 }}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Choose Design */}
        {step === 2 && (
          <div className="money-modal-body step-transition">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Palette size={18} style={{ color: 'var(--accent)' }} />
              <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                Card Design
              </span>
            </div>

            {/* Live Preview */}
            <div className="create-card-preview" style={{ background: selectedStyle.gradient }}>
              <div className="card-preview-decor-1" />
              <div className="card-preview-decor-2" />
              <div className="card-preview-top">
                <span className="card-preview-brand">{cardName.toUpperCase() || 'CARD'}</span>
                <div className="virtual-badge">VIRTUAL</div>
              </div>
              <div className="card-preview-number">•••• •••• •••• ••••</div>
              <div className="card-preview-bottom">
                <div>
                  <div className="card-preview-label">Card Holder</div>
                  <div className="card-preview-value">Liyakhat Yusuf Raza</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="card-preview-label">Limit</div>
                  <div className="card-preview-value">${spendingLimit.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Color Options */}
            <div className="style-grid">
              {CARD_STYLES.map((style) => (
                <button
                  key={style.id}
                  className={`style-option ${selectedStyle.id === style.id ? 'selected' : ''}`}
                  onClick={() => setSelectedStyle(style)}
                >
                  <div className="style-swatch" style={{ background: style.gradient }} />
                  <span className="style-name">{style.name}</span>
                </button>
              ))}
            </div>

            <button className="btn btn-primary money-modal-continue" onClick={handleGoToReview}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && !isSuccess && (
          <div className="money-modal-body step-transition">
            <div className="review-card">
              <div className="review-header">
                <CreditCard size={20} style={{ color: 'var(--accent)' }} />
                <span>Card Summary</span>
              </div>

              <div className="review-row">
                <span className="review-label">Card Name</span>
                <span className="review-value">{cardName.toUpperCase()}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Type</span>
                <span className="review-value">
                  <span className="virtual-badge-sm">VIRTUAL</span>
                </span>
              </div>
              <div className="review-row">
                <span className="review-label">Design</span>
                <span className="review-value">
                  <div className="style-swatch small" style={{ background: selectedStyle.gradient }} />
                  {selectedStyle.name}
                </span>
              </div>
              <div className="review-row">
                <span className="review-label">Spending Limit</span>
                <span className="review-value">${spendingLimit.toLocaleString()}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Card Holder</span>
                <span className="review-value">Liyakhat Yusuf Raza</span>
              </div>
              <div className="review-row">
                <span className="review-label">Fee</span>
                <span className="review-value" style={{ color: 'var(--accent)' }}>Free</span>
              </div>
            </div>

            <button
              className={`btn btn-primary money-modal-confirm ${isProcessing ? 'processing' : ''}`}
              onClick={handleCreateCard}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="processing-spinner" />
              ) : (
                <>Create Virtual Card</>
              )}
            </button>
          </div>
        )}

        {/* Success */}
        {isSuccess && (
          <div className="money-modal-body success-state">
            <div className="success-animation">
              <div className="success-circle">
                <CreditCard size={36} strokeWidth={2.5} />
              </div>
            </div>
            <h3 className="success-title">Card Created!</h3>
            <p className="success-subtitle">
              Your <strong>{cardName.toUpperCase()}</strong> virtual card is ready to use
            </p>

            {createdCard && (
              <div className="created-card-mini" style={{ background: selectedStyle.gradient }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>{createdCard.brand}</span>
                  <span className="virtual-badge" style={{ fontSize: '0.5625rem', padding: '2px 8px' }}>VIRTUAL</span>
                </div>
                <div style={{ fontSize: '1rem', letterSpacing: '2px', fontFamily: 'monospace', marginTop: '12px' }}>
                  •••• •••• •••• {createdCard.lastFour}
                </div>
              </div>
            )}

            <button className="btn btn-primary money-modal-done" onClick={closeCreateCardModal}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

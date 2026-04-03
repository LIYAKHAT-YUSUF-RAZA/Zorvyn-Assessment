import { useState, useEffect } from 'react';
import { X, Search, ArrowRight, ArrowLeft, Check, Send, UserPlus, Zap, AlertCircle } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

const ACCOUNTS = [
  { id: 'chase', name: 'Chase Priority Checking', ending: '3499', balance: 18450.00 },
  { id: 'ally', name: 'Ally High-Yield Savings', ending: '8210', balance: 6646.06 },
];

export default function SendMoneyModal() {
  const {
    sendMoneyModalOpen,
    closeSendMoneyModal,
    contacts,
    sendMoney,
    addContact,
    canSendMoney,
    userRole,
  } = useFinanceStore();

  const [step, setStep] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [fromAccount, setFromAccount] = useState(ACCOUNTS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');

  // Reset when modal opens/closes
  useEffect(() => {
    if (sendMoneyModalOpen) {
      setStep(1);
      setSelectedContact(null);
      setSearchQuery('');
      setAmount('');
      setNote('');
      setFromAccount(ACCOUNTS[0]);
      setIsProcessing(false);
      setIsSuccess(false);
      setAmountError('');
      setShowAddContact(false);
      setNewContactName('');
      setNewContactEmail('');
    }
  }, [sendMoneyModalOpen]);

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setStep(2);
  };

  const handleAddNewContact = () => {
    if (!newContactName.trim()) return;
    const initials = newContactName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#0ea5e9'];
    const newContact = {
      name: newContactName.trim(),
      email: newContactEmail.trim() || `${newContactName.trim().toLowerCase().replace(/\s+/g, '.')}@email.com`,
      initials,
      accountEnding: Math.floor(1000 + Math.random() * 9000).toString(),
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    addContact(newContact);
    setShowAddContact(false);
    setNewContactName('');
    setNewContactEmail('');
  };

  const validateAmount = () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      setAmountError('Please enter a valid amount');
      return false;
    }
    if (val > fromAccount.balance) {
      setAmountError(`Insufficient funds. Available: $${fromAccount.balance.toLocaleString()}`);
      return false;
    }
    setAmountError('');
    return true;
  };

  const handleGoToReview = () => {
    if (validateAmount()) {
      setStep(3);
    }
  };

  const handleConfirmSend = () => {
    setIsProcessing(true);
    setTimeout(() => {
      sendMoney(selectedContact, amount, note, fromAccount.name);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (!sendMoneyModalOpen) return null;

  // Check permissions
  const hasPermission = canSendMoney();
  if (sendMoneyModalOpen && !hasPermission) {
    return (
      <div className="modal-overlay" onClick={closeSendMoneyModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Send Money</h2>
            <button className="btn btn-ghost btn-icon" onClick={closeSendMoneyModal}>
              <X size={18} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', margin: '0 auto', alignItems: 'center' }}>
              <AlertCircle size={32} color="var(--danger)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Access Restricted</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your Viewer role cannot send money. Please switch to Admin role to proceed.</p>
            </div>
            <button className="btn btn-primary" onClick={closeSendMoneyModal} style={{ marginTop: '12px' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={closeSendMoneyModal}>
      <div className="money-modal" onClick={(e) => e.stopPropagation()}>
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
                <h2 className="money-modal-title">Send Money</h2>
                <p className="money-modal-subtitle">
                  {step === 1 && 'Choose a recipient'}
                  {step === 2 && 'Enter amount'}
                  {step === 3 && 'Review & confirm'}
                </p>
              </div>
            </div>
            <button className="money-modal-close" onClick={closeSendMoneyModal}>
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

        {/* Step 1: Select Recipient */}
        {step === 1 && (
          <div className="money-modal-body step-transition">
            <div className="contact-search-wrapper">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="contact-search-input"
                autoFocus
              />
            </div>

            <div className="contact-grid">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  className={`contact-card ${selectedContact?.id === contact.id ? 'selected' : ''}`}
                  onClick={() => handleSelectContact(contact)}
                >
                  <div className="contact-avatar" style={{ background: contact.color }}>
                    {contact.initials}
                  </div>
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-account">•••• {contact.accountEnding}</div>
                </button>
              ))}

              {/* Add new contact */}
              <button
                className="contact-card add-contact-card"
                onClick={() => setShowAddContact(true)}
              >
                <div className="contact-avatar add-avatar">
                  <UserPlus size={20} />
                </div>
                <div className="contact-name">Add New</div>
                <div className="contact-account">Recipient</div>
              </button>
            </div>

            {/* Add Contact Inline Form */}
            {showAddContact && (
              <div className="add-contact-form">
                <h4>Add New Recipient</h4>
                <input
                  type="text"
                  placeholder="Full name"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="input-field"
                  autoFocus
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  className="input-field"
                  style={{ marginTop: '8px' }}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddContact(false)}>Cancel</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddNewContact}>Add</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Enter Amount */}
        {step === 2 && (
          <div className="money-modal-body step-transition">
            <div className="recipient-preview">
              <div className="contact-avatar small" style={{ background: selectedContact?.color }}>
                {selectedContact?.initials}
              </div>
              <span>Sending to <strong>{selectedContact?.name}</strong></span>
            </div>

            <div className="amount-input-section">
              <div className="amount-display">
                <span className="amount-currency">$</span>
                <input
                  type="number"
                  className="amount-big-input"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setAmountError(''); }}
                  autoFocus
                  step="0.01"
                  min="0"
                />
              </div>
              {amountError && <div className="amount-error">{amountError}</div>}
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>From Account</label>
              <div className="account-selector">
                {ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    className={`account-option ${fromAccount.id === acc.id ? 'selected' : ''}`}
                    onClick={() => setFromAccount(acc)}
                  >
                    <div className="account-option-info">
                      <span className="account-option-name">{acc.name}</span>
                      <span className="account-option-ending">•••• {acc.ending}</span>
                    </div>
                    <span className="account-option-balance">${acc.balance.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Note (optional)</label>
              <input
                type="text"
                className="input-field"
                placeholder="What's it for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button className="btn btn-primary money-modal-continue" onClick={handleGoToReview}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && !isSuccess && (
          <div className="money-modal-body step-transition">
            <div className="review-card">
              <div className="review-header">
                <Send size={20} style={{ color: 'var(--accent)' }} />
                <span>Transfer Summary</span>
              </div>

              <div className="review-amount">${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>

              <div className="review-row">
                <span className="review-label">To</span>
                <div className="review-value">
                  <div className="contact-avatar tiny" style={{ background: selectedContact?.color }}>
                    {selectedContact?.initials}
                  </div>
                  {selectedContact?.name}
                </div>
              </div>

              <div className="review-row">
                <span className="review-label">From</span>
                <span className="review-value">{fromAccount.name}</span>
              </div>

              {note && (
                <div className="review-row">
                  <span className="review-label">Note</span>
                  <span className="review-value">{note}</span>
                </div>
              )}

              <div className="review-row">
                <span className="review-label">Arrival</span>
                <span className="review-value review-instant">
                  <Zap size={14} /> Instant
                </span>
              </div>
            </div>

            <button
              className={`btn btn-primary money-modal-confirm ${isProcessing ? 'processing' : ''}`}
              onClick={handleConfirmSend}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="processing-spinner" />
              ) : (
                <>Confirm & Send</>
              )}
            </button>
          </div>
        )}

        {/* Success State */}
        {isSuccess && (
          <div className="money-modal-body success-state">
            <div className="success-animation">
              <div className="success-circle">
                <Check size={40} strokeWidth={3} />
              </div>
            </div>
            <h3 className="success-title">Money Sent!</h3>
            <p className="success-subtitle">
              <strong>${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> has been sent to <strong>{selectedContact?.name}</strong>
            </p>
            <button className="btn btn-primary money-modal-done" onClick={closeSendMoneyModal}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

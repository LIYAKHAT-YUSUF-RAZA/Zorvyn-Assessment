import { useState, useEffect } from 'react';
import { X, Search, ArrowRight, ArrowLeft, Check, Download, UserPlus, Users, AlertCircle } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

export default function RequestMoneyModal() {
  const {
    requestMoneyModalOpen,
    closeRequestMoneyModal,
    contacts,
    requestMoney,
    addContact,
    canRequestMoney,
  } = useFinanceStore();

  const [step, setStep] = useState(1);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [splitEvenly, setSplitEvenly] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');

  // Reset when modal opens/closes
  useEffect(() => {
    if (requestMoneyModalOpen) {
      setStep(1);
      setSelectedContacts([]);
      setSearchQuery('');
      setAmount('');
      setNote('');
      setSplitEvenly(true);
      setIsProcessing(false);
      setIsSuccess(false);
      setAmountError('');
      setShowAddContact(false);
      setNewContactName('');
      setNewContactEmail('');
    }
  }, [requestMoneyModalOpen]);

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleContact = (contact) => {
    setSelectedContacts((prev) => {
      const exists = prev.find((c) => c.id === contact.id);
      if (exists) return prev.filter((c) => c.id !== contact.id);
      return [...prev, contact];
    });
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

  const handleGoToAmount = () => {
    if (selectedContacts.length === 0) return;
    setStep(2);
  };

  const validateAmount = () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      setAmountError('Please enter a valid amount');
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

  const perPersonAmount = () => {
    const total = parseFloat(amount) || 0;
    if (splitEvenly && selectedContacts.length > 0) {
      return total / selectedContacts.length;
    }
    return total;
  };

  const handleConfirmRequest = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const amtPerPerson = perPersonAmount();
      requestMoney(selectedContacts, amtPerPerson, note);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  if (!requestMoneyModalOpen) return null;

  // Check permissions
  const hasPermission = canRequestMoney();
  if (requestMoneyModalOpen && !hasPermission) {
    return (
      <div className="modal-overlay" onClick={closeRequestMoneyModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Request Money</h2>
            <button className="btn btn-ghost btn-icon" onClick={closeRequestMoneyModal}>
              <X size={18} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', margin: '0 auto', alignItems: 'center' }}>
              <AlertCircle size={32} color="var(--danger)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Access Restricted</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your Viewer role cannot request money. Please switch to Admin role to proceed.</p>
            </div>
            <button className="btn btn-primary" onClick={closeRequestMoneyModal} style={{ marginTop: '12px' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={closeRequestMoneyModal}>
      <div className="money-modal request-modal" onClick={(e) => e.stopPropagation()}>
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
                <h2 className="money-modal-title">Request Money</h2>
                <p className="money-modal-subtitle">
                  {step === 1 && 'Select who to request from'}
                  {step === 2 && 'Enter amount & details'}
                  {step === 3 && 'Review & send request'}
                </p>
              </div>
            </div>
            <button className="money-modal-close" onClick={closeRequestMoneyModal}>
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

        {/* Step 1: Select Contacts */}
        {step === 1 && (
          <div className="money-modal-body step-transition">
            {selectedContacts.length > 0 && (
              <div className="selected-contacts-bar">
                <Users size={14} />
                <span>{selectedContacts.length} selected</span>
                <div className="selected-avatars">
                  {selectedContacts.slice(0, 4).map((c) => (
                    <div key={c.id} className="contact-avatar micro" style={{ background: c.color }}>
                      {c.initials}
                    </div>
                  ))}
                  {selectedContacts.length > 4 && (
                    <div className="contact-avatar micro more">+{selectedContacts.length - 4}</div>
                  )}
                </div>
              </div>
            )}

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
                  className={`contact-card ${selectedContacts.find(c => c.id === contact.id) ? 'selected' : ''}`}
                  onClick={() => handleToggleContact(contact)}
                >
                  <div className="contact-avatar" style={{ background: contact.color }}>
                    {contact.initials}
                    {selectedContacts.find(c => c.id === contact.id) && (
                      <div className="contact-check">
                        <Check size={10} />
                      </div>
                    )}
                  </div>
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-account">•••• {contact.accountEnding}</div>
                </button>
              ))}

              <button
                className="contact-card add-contact-card"
                onClick={() => setShowAddContact(true)}
              >
                <div className="contact-avatar add-avatar">
                  <UserPlus size={20} />
                </div>
                <div className="contact-name">Add New</div>
                <div className="contact-account">Contact</div>
              </button>
            </div>

            {showAddContact && (
              <div className="add-contact-form">
                <h4>Add New Contact</h4>
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

            <button
              className="btn btn-primary money-modal-continue"
              onClick={handleGoToAmount}
              disabled={selectedContacts.length === 0}
              style={{ opacity: selectedContacts.length === 0 ? 0.5 : 1 }}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Enter Amount */}
        {step === 2 && (
          <div className="money-modal-body step-transition">
            <div className="recipient-preview multi">
              <div className="selected-avatars">
                {selectedContacts.slice(0, 3).map((c) => (
                  <div key={c.id} className="contact-avatar small" style={{ background: c.color }}>
                    {c.initials}
                  </div>
                ))}
              </div>
              <span>
                Requesting from <strong>{selectedContacts.length === 1 ? selectedContacts[0].name : `${selectedContacts.length} people`}</strong>
              </span>
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

            {selectedContacts.length > 1 && (
              <div className="split-toggle">
                <button
                  className={`split-option ${splitEvenly ? 'active' : ''}`}
                  onClick={() => setSplitEvenly(true)}
                >
                  Split Evenly
                </button>
                <button
                  className={`split-option ${!splitEvenly ? 'active' : ''}`}
                  onClick={() => setSplitEvenly(false)}
                >
                  Full Amount Each
                </button>
              </div>
            )}

            {selectedContacts.length > 1 && amount && (
              <div className="split-preview">
                {splitEvenly ? (
                  <span>${(parseFloat(amount) / selectedContacts.length).toFixed(2)} per person</span>
                ) : (
                  <span>${parseFloat(amount).toFixed(2)} from each person</span>
                )}
              </div>
            )}

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label>Reason / Note</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Dinner split, Rent share..."
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
                <Download size={20} style={{ color: '#f59e0b' }} />
                <span>Request Summary</span>
              </div>

              <div className="review-amount">${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              {selectedContacts.length > 1 && splitEvenly && (
                <div className="review-split-note">
                  Split: ${perPersonAmount().toFixed(2)} per person
                </div>
              )}

              <div className="review-row">
                <span className="review-label">From</span>
                <div className="review-value">
                  {selectedContacts.length === 1 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="contact-avatar tiny" style={{ background: selectedContacts[0].color }}>
                        {selectedContacts[0].initials}
                      </div>
                      {selectedContacts[0].name}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="selected-avatars">
                        {selectedContacts.slice(0, 3).map((c) => (
                          <div key={c.id} className="contact-avatar tiny" style={{ background: c.color }}>
                            {c.initials}
                          </div>
                        ))}
                      </div>
                      {selectedContacts.length} people
                    </div>
                  )}
                </div>
              </div>

              {note && (
                <div className="review-row">
                  <span className="review-label">Note</span>
                  <span className="review-value">{note}</span>
                </div>
              )}

              <div className="review-row">
                <span className="review-label">Status</span>
                <span className="review-value">
                  <span className="request-status-badge pending">Pending</span>
                </span>
              </div>
            </div>

            {/* Individual requests breakdown */}
            {selectedContacts.length > 1 && (
              <div className="request-breakdown">
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>Individual Requests</h4>
                {selectedContacts.map((c) => (
                  <div key={c.id} className="request-break-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="contact-avatar tiny" style={{ background: c.color }}>
                        {c.initials}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.name}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      ${perPersonAmount().toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              className={`btn btn-primary money-modal-confirm request-confirm ${isProcessing ? 'processing' : ''}`}
              onClick={handleConfirmRequest}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="processing-spinner" />
              ) : (
                <>Send Request{selectedContacts.length > 1 ? 's' : ''}</>
              )}
            </button>
          </div>
        )}

        {/* Success State */}
        {isSuccess && (
          <div className="money-modal-body success-state">
            <div className="success-animation">
              <div className="success-circle request-success">
                <Check size={40} strokeWidth={3} />
              </div>
            </div>
            <h3 className="success-title">Request{selectedContacts.length > 1 ? 's' : ''} Sent!</h3>
            <p className="success-subtitle">
              You've requested <strong>${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> from{' '}
              <strong>{selectedContacts.length === 1 ? selectedContacts[0].name : `${selectedContacts.length} people`}</strong>
            </p>
            <button className="btn btn-primary money-modal-done" onClick={closeRequestMoneyModal}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

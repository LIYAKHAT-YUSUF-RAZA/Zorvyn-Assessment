import { useState } from 'react';
import { X, Building2, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

const POPULAR_BANKS = [
  { id: 'bofa', name: 'Bank of America', color: '#e11d48', bgColor: '#fff1f2', borderColor: '#ffe4e6' },
  { id: 'wells', name: 'Wells Fargo', color: '#b91c1c', bgColor: '#fef2f2', borderColor: '#fee2e2' },
  { id: 'citi', name: 'Citi', color: '#0284c7', bgColor: '#f0f9ff', borderColor: '#e0f2fe' },
  { id: 'capital', name: 'Capital One', color: '#0f172a', bgColor: '#f8fafc', borderColor: '#e2e8f0' }
];

export default function ConnectBankModal() {
  const { connectBankModalOpen, closeConnectBankModal, addConnectedBank, canConnectBanks } = useFinanceStore();
  const [selectedBank, setSelectedBank] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  if (!connectBankModalOpen) return null;

  // Check permissions
  const hasPermission = canConnectBanks();
  if (!hasPermission) {
    return (
      <div className="modal-overlay" onClick={closeConnectBankModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Connect Bank</h2>
            <button className="btn btn-ghost btn-icon" onClick={closeConnectBankModal}>
              <X size={18} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', margin: '0 auto', alignItems: 'center' }}>
              <AlertCircle size={32} color="var(--danger)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Access Restricted</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your Viewer role cannot connect banks. Please switch to Admin role to proceed.</p>
            </div>
            <button className="btn btn-primary" onClick={closeConnectBankModal} style={{ marginTop: '12px' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleConnect = () => {
    if (!selectedBank) return;
    setIsConnecting(true);
    setTimeout(() => {
      addConnectedBank({
        name: selectedBank.name,
        balance: Math.floor(Math.random() * 5000) + 1000,
        color: selectedBank.color,
        bgColor: selectedBank.bgColor,
        borderColor: selectedBank.borderColor,
        type: 'Checking Account'
      });
      setIsConnecting(false);
      closeConnectBankModal();
      setSelectedBank(null);
    }, 1500);
  };

  const handleClose = () => {
    closeConnectBankModal();
    setSelectedBank(null);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="money-modal" onClick={(e) => e.stopPropagation()}>
        <div className="money-modal-header">
          <div>
            <h2 className="money-modal-title">Connect Bank</h2>
            <p className="money-modal-subtitle">Securely link your bank account</p>
          </div>
          <button className="money-modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="money-modal-body" style={{ marginTop: '20px' }}>
          <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
            {POPULAR_BANKS.map((bank) => (
              <div 
                key={bank.id}
                onClick={() => setSelectedBank(bank)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px', borderRadius: '12px', cursor: 'pointer',
                  border: `2px solid ${selectedBank?.id === bank.id ? 'var(--accent)' : 'var(--border-color)'}`,
                  background: selectedBank?.id === bank.id ? 'var(--accent-bg)' : 'var(--bg-tertiary)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bank.bgColor, border: `1px solid ${bank.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={20} color={bank.color} />
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{bank.name}</span>
                </div>
                {selectedBank?.id === bank.id && (
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={14} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '24px', color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
            <ShieldCheck size={16} /> Secured by Plaid encryption
          </div>

          <button 
            className={`btn btn-primary money-modal-confirm ${isConnecting ? 'processing' : ''}`}
            onClick={handleConnect}
            disabled={!selectedBank || isConnecting}
            style={{ opacity: !selectedBank ? 0.5 : 1 }}
          >
            {isConnecting ? <span className="processing-spinner" /> : 'Connect Account'}
          </button>
        </div>
      </div>
    </div>
  );
}

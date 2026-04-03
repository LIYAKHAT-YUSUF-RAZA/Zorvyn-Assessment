import { useState } from 'react';
import PageTabs from '../components/PageTabs';
import { CreditCard, Building, Plus, MoreVertical, Shield, ShieldOff, Smartphone, ArrowRight, Zap, RefreshCcw, Lock, Eye, Snowflake, Trash2, AlertCircle } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

export default function WalletPage() {
  const {
    walletCards,
    openCardDetail,
    openCreateCardModal,
    toggleFreezeCard,
    connectedBanks,
    openConnectBankModal,
    transferFromBank,
    removeConnectedBank,
    canCreateCards,
    canFreezeCards,
    canDisconnectBanks,
    canConnectBanks,
    userRole
  } = useFinanceStore();

  const [transferFrom, setTransferFrom] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [openBankMenuId, setOpenBankMenuId] = useState(null);

  const activeTransferFrom = transferFrom || connectedBanks[0]?.id;

  const handleTransfer = () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0 || !activeTransferFrom) return;
    
    transferFromBank(activeTransferFrom, transferAmount);
    
    setTransferSuccess(true);
    setTimeout(() => {
      setTransferSuccess(false);
      setTransferAmount('');
    }, 2000);
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-greeting">Your <span>Wallet</span></h1>
            <p className="page-subtitle">Manage your linked cards and bank accounts</p>
          </div>
          <PageTabs />
        </div>
        {userRole === 'viewer' && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--warning-bg)', border: '1px solid var(--warning)', color: 'var(--warning)' }}>
              <AlertCircle size={16} />
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Viewer role: Card/Bank management is unavailable. Switch to Admin to make changes.</span>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Cards Section */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                My Cards
                <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-tertiary)', marginLeft: '10px' }}>
                  {walletCards.length} card{walletCards.length !== 1 ? 's' : ''}
                </span>
              </h3>
              <button 
                className="action-btn secondary" 
                style={{ fontSize: '0.875rem', opacity: canCreateCards() ? 1 : 0.5, cursor: canCreateCards() ? 'pointer' : 'not-allowed' }} 
                onClick={canCreateCards() ? openCreateCardModal : undefined}
                disabled={!canCreateCards()}
                title={!canCreateCards() ? 'Only Admin can add cards' : 'Add a new card'}
              >
                <Plus size={16} style={{ marginRight: '6px' }} /> Add Card
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
              {walletCards.map((card) => (
                <div
                  key={card.id}
                  className={`wallet-card-item ${card.frozen ? 'frozen' : ''}`}
                  style={{ background: card.gradient }}
                  onClick={() => openCardDetail(card)}
                >
                  {/* Frozen Overlay */}
                  {card.frozen && (
                    <div className="wallet-card-frozen-badge">
                      <Snowflake size={12} />
                      Frozen
                    </div>
                  )}

                  {/* Decorative elements */}
                  <div className="card-preview-decor-1" />
                  <div className="card-preview-decor-2" />
                  
                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: card.brand === 'Z-TITANIUM' ? '0.5px' : '1px', fontStyle: card.brand === 'Z-TITANIUM' ? 'italic' : 'normal' }}>
                      {card.brand}
                    </span>
                    {card.type === 'virtual' ? (
                      <span className="virtual-badge">VIRTUAL</span>
                    ) : card.color === 'dark' ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <span style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }} />
                        <span style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', marginLeft: '-14px', backdropFilter: 'blur(4px)' }} />
                      </div>
                    ) : (
                      <CreditCard size={28} style={{ opacity: 0.9 }} />
                    )}
                  </div>

                  {/* Card Number */}
                  <div style={{ fontSize: '1.375rem', letterSpacing: '3px', fontFamily: 'monospace', textShadow: '0 2px 4px rgba(0,0,0,0.2)', position: 'relative', zIndex: 1, marginTop: '8px' }}>
                    •••• •••• •••• {card.lastFour}
                  </div>

                  {/* Bottom row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', opacity: 0.9, position: 'relative', zIndex: 1 }}>
                    <div>
                      <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', opacity: 0.8, marginBottom: '2px', letterSpacing: '1px' }}>Card Holder</div>
                      <div style={{ fontWeight: 500, letterSpacing: '0.5px' }}>{card.holder}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', opacity: 0.8, marginBottom: '2px', letterSpacing: '1px' }}>Expires</div>
                      <div style={{ fontWeight: 500, letterSpacing: '0.5px' }}>{card.expiry}</div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="wallet-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="wallet-card-action-btn"
                      title="View Details"
                      onClick={() => openCardDetail(card)}
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="wallet-card-action-btn"
                      title={card.frozen ? 'Unfreeze' : 'Freeze'}
                      onClick={() => canFreezeCards() && toggleFreezeCard(card.id)}
                      disabled={!canFreezeCards()}
                      style={{ opacity: canFreezeCards() ? 1 : 0.5, cursor: canFreezeCards() ? 'pointer' : 'not-allowed' }}
                    >
                      {card.frozen ? <ShieldOff size={14} /> : <Shield size={14} />}
                    </button>
                  </div>
                </div>
              ))}

              {/* Add New Placeholder */}
              <div
                className="wallet-add-card"
                onClick={canCreateCards() ? openCreateCardModal : undefined}
                style={{ opacity: canCreateCards() ? 1 : 0.5, cursor: canCreateCards() ? 'pointer' : 'not-allowed' }}
                title={!canCreateCards() ? 'Only Admin can create cards' : 'Create a new card'}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <Plus size={24} />
                </div>
                <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Get Virtual Card</span>
              </div>
            </div>
          </div>

          {/* Connected Banks */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Connected Banks</h3>
              <button style={{ color: 'var(--success)', background: 'none', border: 'none', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <RefreshCcw size={14} /> Sync Accounts
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {connectedBanks.map((bank) => (
                <div key={bank.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', transition: 'all 0.2s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', background: bank.bgColor, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${bank.borderColor}` }}>
                      <Building size={24} color={bank.color} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.0625rem', marginBottom: '2px' }}>{bank.name}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Account ending in •••• {bank.lastFour}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-primary)' }}>${bank.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div style={{ fontSize: '0.75rem', color: bank.type === 'Primary Account' ? 'var(--success)' : 'var(--text-tertiary)', fontWeight: bank.type === 'Primary Account' ? 600 : 500, marginTop: '2px' }}>{bank.type}</div>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <button 
                        onClick={() => setOpenBankMenuId(openBankMenuId === bank.id ? null : bank.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '4px' }}
                      >
                        <MoreVertical size={20} />
                      </button>

                      {openBankMenuId === bank.id && (
                        <>
                          <div 
                            onClick={() => setOpenBankMenuId(null)}
                            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                          />
                          <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '100%',
                            marginTop: '4px',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-light)',
                            borderRadius: '8px',
                            boxShadow: 'var(--shadow-md)',
                            padding: '4px',
                            zIndex: 50,
                            minWidth: '160px'
                          }}>
                            <button
                              onClick={() => {
                                if (canDisconnectBanks()) {
                                  removeConnectedBank(bank.id);
                                  setOpenBankMenuId(null);
                                }
                              }}
                              disabled={!canDisconnectBanks()}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                width: '100%',
                                padding: '8px 12px',
                                background: 'transparent',
                                border: 'none',
                                color: canDisconnectBanks() ? 'var(--danger)' : 'var(--text-tertiary)',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: canDisconnectBanks() ? 'pointer' : 'not-allowed',
                                borderRadius: '4px',
                                transition: 'all 0.2s ease',
                                textAlign: 'left',
                                opacity: canDisconnectBanks() ? 1 : 0.5
                              }}
                              onMouseOver={(e) => canDisconnectBanks() && (e.currentTarget.style.background = 'var(--danger-bg)')}
                              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                              title={!canDisconnectBanks() ? 'Only Admin can disconnect banks' : 'Disconnect this bank'}
                            >
                              <Trash2 size={16} /> Disconnect Bank
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={canConnectBanks() ? openConnectBankModal : undefined}
                disabled={!canConnectBanks()}
                style={{ width: '100%', padding: '16px', background: 'transparent', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: canConnectBanks() ? 'pointer' : 'not-allowed', transition: 'all 0.2s ease', marginTop: '4px', opacity: canConnectBanks() ? 1 : 0.5 }}
                title={!canConnectBanks() ? 'Only Admin can connect banks' : 'Connect a new bank'}
              >
                <Plus size={18} style={{ marginRight: '8px' }} /> Connect Another Bank
              </button>
            </div>
          </div>
        </div>
        
        {/* Side Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Card Security — now interactive */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>Card Security</h3>
            
            {walletCards.length > 0 ? (
              <>
                {walletCards.map((card) => (
                  <div key={card.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ 
                      width: '44px', height: '44px', borderRadius: '12px', 
                      background: card.frozen ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      color: card.frozen ? 'var(--info)' : 'var(--success)', 
                      border: `1px solid ${card.frozen ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)'}` 
                    }}>
                      {card.frozen ? <Lock size={22} /> : <Shield size={22} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{card.brand}</div>
                      <div style={{ fontSize: '0.75rem', color: card.frozen ? 'var(--info)' : 'var(--text-secondary)' }}>
                        {card.frozen ? 'Currently frozen' : 'Active & secure'}
                      </div>
                    </div>
                    {/* Toggle */}
                    <div
                      onClick={() => canFreezeCards() && toggleFreezeCard(card.id)}
                      style={{
                        width: '44px', height: '24px',
                        background: card.frozen ? 'var(--info)' : 'var(--border-color)',
                        borderRadius: '12px', position: 'relative', cursor: canFreezeCards() ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s ease',
                        opacity: canFreezeCards() ? 1 : 0.5
                      }}
                      title={!canFreezeCards() ? 'Only Admin can freeze/unfreeze cards' : (card.frozen ? 'Unfreeze card' : 'Freeze card')}
                    >
                      <div style={{
                        width: '20px', height: '20px', background: 'white', borderRadius: '50%',
                        position: 'absolute', top: '2px',
                        left: card.frozen ? '22px' : '2px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        transition: 'left 0.3s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-tertiary)' }}>
                <Shield size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <p style={{ fontSize: '0.8125rem' }}>No cards to manage</p>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                <Smartphone size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>Apple Pay</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ready to use in store</div>
              </div>
              <div style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '20px' }}>Active</div>
            </div>

            <button className="action-btn secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '12px' }}>
              Manage Settings <ArrowRight size={16} style={{ marginLeft: '6px' }} />
            </button>
          </div>

          {/* Quick Transfer Widget */}
          <div className="card" style={{ padding: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)' }}>
                <Zap size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>Quick Transfer</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Move funds instantly</p>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>From Account</label>
              <select
                value={activeTransferFrom}
                onChange={(e) => setTransferFrom(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9375rem', appearance: 'none' }}
              >
                {connectedBanks.map((b) => (
                  <option key={b.id} value={b.id}>{b.name} (•••• {b.lastFour})</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Amount</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.125rem' }}>$</span>
                <input
                  type="text"
                  placeholder="0.00"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px 12px 36px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.125rem' }}
                />
              </div>
            </div>

            <button
              className="action-btn primary"
              style={{
                width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', fontWeight: 600,
                background: transferSuccess ? 'var(--success)' : undefined,
              }}
              onClick={handleTransfer}
            >
              {transferSuccess ? '✓ Transferred!' : 'Transfer Funds'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

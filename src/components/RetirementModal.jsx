import { useState } from 'react';
import { X, Heart, Shield, LineChart, PieChart, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

export default function RetirementModal() {
  const { retirementModalOpen, closeRetirementModal } = useFinanceStore();
  const [isScheduled, setIsScheduled] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!retirementModalOpen) return null;

  const handleSchedule = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsScheduled(true);
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={closeRetirementModal}>
      <div className="money-modal retirement-modal-content animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="money-modal-header" style={{ 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
          margin: '-24px -24px 20px -24px', 
          padding: '40px 32px', 
          borderRadius: '20px 20px 0 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: 20, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 className="money-modal-title" style={{ color: 'white', fontSize: '1.75rem', marginBottom: '8px' }}>Retirement Planning</h2>
            <p className="money-modal-subtitle" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', fontWeight: 500 }}>Secure your financial future with Zorvyn</p>
          </div>
          <button className="money-modal-close" onClick={closeRetirementModal} style={{ color: 'white', background: 'rgba(255,255,255,0.15)', top: '24px', right: '24px' }}>
            <X size={20} />
          </button>
        </div>

        <div className="money-modal-body" style={{ padding: '0 8px 8px' }}>
          {isScheduled ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ 
                width: 80, height: 80, borderRadius: '50%', background: '#f0fdf4', color: '#10b981',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.1)'
              }}>
                <CheckCircle2 size={40} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Consultation Requested!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32, maxWidth: '320px', margin: '0 auto 32px' }}>
                One of our expert financial advisors will reach out to you within 24 hours to discuss your personalized retirement strategy.
              </p>
              <button className="btn btn-primary" onClick={closeRetirementModal} style={{ width: '100%', padding: '16px', fontSize: '1.05rem' }}>
                Got it
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div style={{ 
                  padding: 16, borderRadius: 16, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                  display: 'flex', flexDirection: 'column', gap: 12
                }}>
                  <div style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 4 }}>Full Protection</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>Diversified low-risk assets for maximum safety.</p>
                  </div>
                </div>
                <div style={{ 
                  padding: 16, borderRadius: 16, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                  display: 'flex', flexDirection: 'column', gap: 12
                }}>
                  <div style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LineChart size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 4 }}>Optimized ROI</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>Compounded growth tracking & automated rebalancing.</p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                   Why choose Zorvyn?
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 0, margin: 0, listStyle: 'none' }}>
                  {[
                    'Personalized 401(k) and IRA management',
                    'Tax-deferred growth strategies',
                    'Automated contribution matching estimates',
                    'Zero management fees for direct users'
                  ].map((text, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ 
                padding: 16, borderRadius: 16, background: 'linear-gradient(to right, rgba(16, 185, 129, 0.05), transparent)', 
                border: '1px solid rgba(16, 185, 129, 0.1)', marginBottom: 24,
                display: 'flex', alignItems: 'center', gap: 16
              }}>
                <div style={{ 
                  width: 44, height: 44, borderRadius: '50%', background: 'white', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Users size={22} color="#10b981" />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>Talk to an Expert</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Free 30-min strategy session included</div>
                </div>
              </div>

              <button 
                className={`btn btn-primary ${loading ? 'processing' : ''}`}
                onClick={handleSchedule}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
                  border: 'none',
                  color: 'white'
                }}
              >
                {loading ? (
                  <span className="processing-spinner" />
                ) : (
                  <>Schedule Consultation <ArrowRight size={18} /></>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

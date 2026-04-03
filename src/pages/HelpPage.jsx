import { useState } from 'react';
import { Mail, MessageCircle, Phone, Info, ChevronDown, ChevronUp, ExternalLink, LifeBuoy } from 'lucide-react';
import PageTabs from '../components/PageTabs';

const faqs = [
  {
    question: "How do I add a new connected bank account?",
    answer: "You can add a new connected bank account by visiting the 'Wallet' page and clicking the 'Connect Bank' button. You'll need your routing and account numbers, or you can use our secure Plaid integration."
  },
  {
    question: "What is my daily transaction limit?",
    answer: "By default, your account has a daily transfer limit of $5,000 and a daily spending limit of $10,000 across all cards. You can request a limit increase from your Account Settings."
  },
  {
    question: "How long do transfers take to settle?",
    answer: "Standard ACH transfers typically take 2-3 business days. Wire transfers and instant debit card transfers are processed immediately but may incur additional fees."
  },
  {
    question: "How do I report a suspicious transaction?",
    answer: "If you notice a transaction you don't recognize, freeze your card immediately from the 'Wallet' tab, then contact our fraud department using the emergency number below."
  }
];

export default function HelpPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-greeting">Help & <span>Support</span></h1>
            <p className="page-subtitle">Get assistance and find answers to common questions</p>
          </div>
          <PageTabs />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Contact Support */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div className="txn-icon" style={{ background: 'var(--brand-primary)', color: 'white' }}>
              <LifeBuoy size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Contact Support</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>We're here to help 24/7</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px', borderRadius: '50%', color: 'var(--brand-primary)' }}>
                <MessageCircle size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>Live Chat</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Average response time: 2 mins</p>
              </div>
              <button className="btn btn-primary btn-sm">Start Chat</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '50%', color: 'var(--success)' }}>
                <Mail size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>Email Support</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>support@zorvyn.com</p>
              </div>
              <button className="btn btn-outline btn-sm">Send Email</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '50%', color: 'var(--danger)' }}>
                <Phone size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>Phone Support</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>1-800-ZORVYN-8</p>
              </div>
              <button className="btn btn-outline btn-sm">Call Us</button>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div className="txn-icon" style={{ background: 'var(--success)', color: 'white' }}>
              <Info size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Frequently Asked Questions</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Quick answers to common issues</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faqs.map((faq, index) => (
              <div 
                key={index}
                style={{ 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)}
                  style={{
                    width: '100%',
                    padding: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: openFaqIndex === index ? 'var(--bg-secondary)' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem'
                  }}
                >
                  {faq.question}
                  {openFaqIndex === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openFaqIndex === index && (
                  <div style={{ 
                    padding: '0 15px 15px 15px', 
                    fontSize: '0.85rem', 
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                    background: 'var(--bg-secondary)'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* System Status & Resources */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div className="txn-icon" style={{ background: 'var(--text-primary)', color: 'var(--bg-color)' }}>
              <ExternalLink size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Resources</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Documentation and system status</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 500 }}>System Status</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>All systems operational</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
                <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Online</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 500 }}>API Documentation</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Integrate Zorvyn into your apps</p>
              </div>
              <ExternalLink size={16} style={{ color: 'var(--text-tertiary)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 500 }}>Community Forums</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Discuss features with other users</p>
              </div>
              <ExternalLink size={16} style={{ color: 'var(--text-tertiary)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

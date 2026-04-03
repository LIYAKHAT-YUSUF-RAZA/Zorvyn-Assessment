import { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Download,
  Copy,
  Check,
  Wallet,
} from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

const formatCurrency = (value) => {
  const abs = Math.abs(value);
  const whole = Math.floor(abs).toLocaleString();
  const decimal = (abs % 1).toFixed(2).substring(1);
  return { whole, decimal, negative: value < 0 };
};

// Mini sparkline SVG component
function Sparkline({ data, color, height = 32 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} style={{ display: 'block', opacity: 0.6 }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Animated number counter
function AnimatedNumber({ value, prefix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    const start = displayValue;
    const end = value;
    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(start + (end - start) * eased));
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [value]);

  const formatted = formatCurrency(displayValue);
  return (
    <>
      {prefix}${formatted.whole}<span className="cents">{formatted.decimal}</span>
    </>
  );
}

export default function SummaryCards() {
  const { getTotalBalance, getTotalIncome, getTotalExpenses, getMonthlyData, getCategoryBreakdown, openSendMoneyModal, openRequestMoneyModal, canSendMoney, canRequestMoney, userRole } = useFinanceStore();
  const [copied, setCopied] = useState(false);
  const [expenseTab, setExpenseTab] = useState('Monthly');

  const totalBalance = getTotalBalance();
  const monthlyData = getMonthlyData();
  const categoryBreakdown = getCategoryBreakdown();

  const currentMonth = monthlyData[monthlyData.length - 1] || { income: 0, expenses: 0 };
  const prevMonth = monthlyData[monthlyData.length - 2] || { income: 0, expenses: 0 };

  const incomeChange = prevMonth.income > 0
    ? ((currentMonth.income - prevMonth.income) / prevMonth.income * 100).toFixed(1)
    : '0.0';
  const expenseChange = prevMonth.expenses > 0
    ? ((currentMonth.expenses - prevMonth.expenses) / prevMonth.expenses * 100).toFixed(1)
    : '0.0';

  const balanceFmt = formatCurrency(totalBalance);
  const incomeFmt = formatCurrency(currentMonth.income);
  const expenseFmt = formatCurrency(currentMonth.expenses);

  const widgetExpenseValue = 
    expenseTab === 'Daily' ? currentMonth.expenses / 30 :
    expenseTab === 'Weekly' ? currentMonth.expenses / 4 :
    currentMonth.expenses;
  const widgetExpenseFmt = formatCurrency(widgetExpenseValue);

  // Sparkline data from monthly
  const incomeSparkline = monthlyData.map(m => m.income);
  const expenseSparkline = monthlyData.map(m => m.expenses);

  // Top expense categories for the widget
  const totalExpenses = currentMonth.expenses;
  const topCategories = categoryBreakdown.slice(0, 4).map(cat => ({
    ...cat,
    pct: totalExpenses > 0 ? Math.round((cat.value / getTotalExpenses()) * 100) : 0,
  }));

  const categoryColors = {
    'Rent': '#ef4444',
    'Food & Dining': '#f97316',
    'Shopping': '#ec4899',
    'Travel': '#3b82f6',
    'Bills & Utilities': '#64748b',
    'Entertainment': '#a855f7',
    'Healthcare': '#10b981',
    'Transport': '#eab308',
    'Education': '#14b8a6',
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText('6549 7329 9821 2472');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="summary-grid">
      {/* Balance Card - Premium Dark */}
      <div className="card summary-card balance-card animate-in" id="total-balance">
        <div className="card-label">My Balance</div>
        <div className="card-value">
          <AnimatedNumber value={totalBalance} prefix="" />
        </div>
        <div className="card-compare">
          <span className="compare-badge up">
            <ArrowUpRight size={12} /> +6.7%
          </span>
          <span className="compare-text">compared to last month</span>
        </div>
        <div className="card-number">
          <span>6549 &nbsp;7329 &nbsp;9821 &nbsp;2472</span>
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="balance-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button 
            className="action-btn primary" 
            onClick={openSendMoneyModal}
            disabled={!canSendMoney()}
            title={!canSendMoney() ? 'Only Admin can send money' : 'Send money'}
            style={{
              background: canSendMoney() 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 16px',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: canSendMoney() ? 'pointer' : 'not-allowed',
              opacity: canSendMoney() ? 1 : 0.6,
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: canSendMoney()
                ? '0 8px 20px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              if (canSendMoney()) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(16, 185, 129, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (canSendMoney()) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              }
            }}
          >
            <Send size={16} style={{ marginRight: '4px' }} /> Send money
          </button>
          <button 
            className="action-btn secondary" 
            onClick={openRequestMoneyModal}
            disabled={!canRequestMoney()}
            title={!canRequestMoney() ? 'Only Admin can request money' : 'Request money'}
            style={{
              background: canRequestMoney()
                ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 16px',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: canRequestMoney() ? 'pointer' : 'not-allowed',
              opacity: canRequestMoney() ? 1 : 0.6,
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: canRequestMoney()
                ? '0 8px 20px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              if (canRequestMoney()) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (canRequestMoney()) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              }
            }}
          >
            <Download size={16} style={{ marginRight: '4px' }} /> Request money
          </button>
        </div>
      </div>

      {/* Monthly Income */}
      <div className="card summary-card animate-in" id="monthly-income">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(16, 185, 129, 0.15)',
          }}>
            <TrendingUp size={22} style={{ color: 'var(--success)' }} />
          </div>
          <Sparkline data={incomeSparkline} color="#10b981" />
        </div>
        <div className="card-label">Monthly Income</div>
        <div className="card-value">
          ${incomeFmt.whole}<span className="cents">{incomeFmt.decimal}</span>
        </div>
        <div className="card-compare">
          <span className={`compare-badge ${parseFloat(incomeChange) >= 0 ? 'up' : 'down'}`}>
            {parseFloat(incomeChange) >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {incomeChange > 0 ? '+' : ''}{incomeChange}%
          </span>
          <span className="compare-text">vs last month</span>
        </div>
      </div>

      {/* Monthly Expenses */}
      <div className="card summary-card animate-in" id="monthly-expenses">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(239, 68, 68, 0.04))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(239, 68, 68, 0.12)',
          }}>
            <TrendingDown size={22} style={{ color: 'var(--danger)' }} />
          </div>
          <Sparkline data={expenseSparkline} color="#ef4444" />
        </div>
        <div className="card-label">Monthly Expenses</div>
        <div className="card-value">
          ${expenseFmt.whole}<span className="cents">{expenseFmt.decimal}</span>
        </div>
        <div className="card-compare">
          <span className={`compare-badge ${parseFloat(expenseChange) > 0 ? 'down' : 'up'}`}>
            {parseFloat(expenseChange) > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {expenseChange > 0 ? '+' : ''}{expenseChange}%
          </span>
          <span className="compare-text">vs last month</span>
        </div>
      </div>

      {/* All Expenses Widget */}
      <div className="card summary-card animate-in" id="all-expenses">
        <div className="card-label" style={{ marginBottom: 8 }}>All Expenses</div>
        <div className="spending-widget-tabs">
          <button className={`spending-widget-tab ${expenseTab === 'Daily' ? 'active' : ''}`} onClick={() => setExpenseTab('Daily')}>Daily</button>
          <button className={`spending-widget-tab ${expenseTab === 'Weekly' ? 'active' : ''}`} onClick={() => setExpenseTab('Weekly')}>Weekly</button>
          <button className={`spending-widget-tab ${expenseTab === 'Monthly' ? 'active' : ''}`} onClick={() => setExpenseTab('Monthly')}>Monthly</button>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
          }}>
            ${widgetExpenseFmt.whole}<span style={{ fontSize: '1.125rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{widgetExpenseFmt.decimal}</span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: 2, fontWeight: 500 }}>
            {expenseTab === 'Daily' ? "Today's average" : expenseTab === 'Weekly' ? "This week's total" : "This month's total"}
          </div>
        </div>
        {/* Real progress bars from data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {topCategories.map((item) => (
            <div key={item.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                <span style={{ fontWeight: 500 }}>{item.name}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.pct}%</span>
              </div>
              <div style={{
                height: 5,
                borderRadius: 3,
                background: 'var(--bg-tertiary)',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${item.pct}%`,
                  height: '100%',
                  borderRadius: 3,
                  background: categoryColors[item.name] || '#94a3b8',
                  transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import {
  TrendingUp,
  TrendingDown,
  PieChart,
  Zap,
  DollarSign,
  Target,
} from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

const monthNames = {
  '01': 'January', '02': 'February', '03': 'March', '04': 'April',
  '05': 'May', '06': 'June', '07': 'July', '08': 'August',
  '09': 'September', '10': 'October', '11': 'November', '12': 'December',
};

const formatMonthName = (monthStr) => {
  if (!monthStr) return 'N/A';
  const parts = monthStr.split('-');
  return `${monthNames[parts[1]]} ${parts[0]}`;
};

export default function InsightsPanel() {
  const { getInsights } = useFinanceStore();
  const insights = getInsights();

  const insightCards = [
    {
      id: 'highest-spending',
      title: 'Highest Spending',
      value: insights.highestCategory.name,
      description: `${formatCurrency(insights.highestCategory.amount)} spent, making up ${insights.highestCategory.percent.toFixed(1)}% of all expenses.`,
      icon: PieChart,
      variant: 'danger',
      badge: formatCurrency(insights.highestCategory.amount),
      iconColor: '#ef4444',
      iconBg: 'var(--danger-bg)',
    },
    {
      id: 'spending-trend',
      title: 'Monthly Trend',
      value: `${Math.abs(insights.spendingChange.percent).toFixed(1)}%`,
      description: insights.spendingChange.increased
        ? `Spending increased compared to ${formatMonthName(insights.spendingChange.previousMonth)}.`
        : `Spending decreased compared to ${formatMonthName(insights.spendingChange.previousMonth)}. Keep it up!`,
      icon: insights.spendingChange.increased ? TrendingUp : TrendingDown,
      variant: insights.spendingChange.increased ? 'warning' : 'success',
      badge: insights.spendingChange.increased ? '↑ Increased' : '↓ Decreased',
      iconColor: insights.spendingChange.increased ? '#f59e0b' : '#10b981',
      iconBg: insights.spendingChange.increased ? 'var(--warning-bg)' : 'var(--success-bg)',
    },
    {
      id: 'savings-rate',
      title: 'Savings Rate',
      value: `${insights.savingsRate.percent.toFixed(1)}%`,
      description: insights.savingsRate.percent > 20
        ? `Excellent! Saving ${insights.savingsRate.percent.toFixed(1)}% of income in ${formatMonthName(insights.savingsRate.currentMonth)}.`
        : `You're saving ${insights.savingsRate.percent.toFixed(1)}% — aim for 20%+.`,
      icon: Target,
      variant: insights.savingsRate.percent > 20 ? 'success' : 'warning',
      badge: insights.savingsRate.percent > 20 ? 'Excellent' : 'Improve',
      iconColor: insights.savingsRate.percent > 20 ? '#10b981' : '#f59e0b',
      iconBg: insights.savingsRate.percent > 20 ? 'var(--success-bg)' : 'var(--warning-bg)',
    },
    {
      id: 'daily-average',
      title: 'Daily Avg Spend',
      value: formatCurrency(insights.averageDailySpend),
      description: `Your average daily expenditure based on the current month data.`,
      icon: DollarSign,
      variant: 'info',
      badge: 'Per Day',
      iconColor: '#3b82f6',
      iconBg: 'var(--info-bg)',
    },
    {
      id: 'lowest-spending',
      title: 'Lowest Category',
      value: insights.lowestCategory.name,
      description: `${insights.lowestCategory.name} had the least spending at ${formatCurrency(insights.lowestCategory.amount)}.`,
      icon: Zap,
      variant: 'success',
      badge: formatCurrency(insights.lowestCategory.amount),
      iconColor: '#10b981',
      iconBg: 'var(--success-bg)',
    },
    {
      id: 'categories-count',
      title: 'Active Categories',
      value: insights.totalCategories,
      description: `Expenses across ${insights.totalCategories} categories. Consolidate where possible.`,
      icon: PieChart,
      variant: 'info',
      badge: `${insights.totalCategories} Total`,
      iconColor: '#8b5cf6',
      iconBg: 'var(--purple-bg)',
    },
  ];

  return (
    <div className="page-enter">
      <div className="insights-grid">
        {insightCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} id={card.id} className={`insight-card ${card.variant} animate-in`}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 16,
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  background: card.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.iconColor,
                }}>
                  <Icon size={20} />
                </div>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: card.iconBg,
                  color: card.iconColor,
                }}>
                  {card.badge}
                </span>
              </div>

              <div style={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: 4,
              }}>
                {card.title}
              </div>

              <div style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: 8,
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}>
                {card.value}
              </div>

              <p style={{
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}>
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  Zap,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Calendar,
  Wallet,
  ArrowRight,
  Flame,
  CreditCard,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  Line,
} from 'recharts';
import useFinanceStore from '../store/useFinanceStore';
import { categoryColors } from '../data/transactions';
import PageTabs from '../components/PageTabs';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

const monthNames = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
};

const fullMonthNames = {
  '01': 'January', '02': 'February', '03': 'March', '04': 'April',
  '05': 'May', '06': 'June', '07': 'July', '08': 'August',
  '09': 'September', '10': 'October', '11': 'November', '12': 'December',
};

const formatMonth = (month) => {
  if (!month) return '';
  const parts = month.split('-');
  return monthNames[parts[1]] || parts[1];
};

const formatFullMonth = (monthStr) => {
  if (!monthStr) return 'N/A';
  const parts = monthStr.split('-');
  return `${fullMonthNames[parts[1]]} ${parts[0]}`;
};

// === Reusable Chart Tooltip ===
function ChartTooltip({ active, payload, label, formatLabel }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="analytics-tooltip">
      <p className="analytics-tooltip-label">{formatLabel ? formatLabel(label) : label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="analytics-tooltip-row">
          <span className="analytics-tooltip-dot" style={{ background: entry.color || entry.stroke }} />
          <span className="analytics-tooltip-name">{entry.name}</span>
          <span className="analytics-tooltip-value">
            {typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// === Financial Health Score Ring ===
function HealthScoreRing({ score }) {
  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  return (
    <div className="health-score-ring">
      <svg width={radius * 2} height={radius * 2}>
        <circle
          stroke="var(--border-color)"
          fill="none"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={getColor()}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>
      <div className="health-score-content">
        <div className="health-score-number" style={{ color: getColor() }}>{score}</div>
        <div className="health-score-label">{getLabel()}</div>
      </div>
    </div>
  );
}

// === Spending Heatmap ===
function SpendingHeatmap({ data }) {
  const maxAmount = Math.max(...data.map(d => d.amount), 1);
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Group by weeks
  const weeks = [];
  let currentWeek = [];
  data.forEach((d, i) => {
    if (i > 0 && d.dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(d);
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const getColor = (amount) => {
    if (amount === 0) return 'var(--bg-tertiary)';
    const intensity = Math.min(amount / maxAmount, 1);
    if (intensity > 0.75) return '#ef4444';
    if (intensity > 0.5) return '#f97316';
    if (intensity > 0.25) return '#fbbf24';
    return '#10b981';
  };

  return (
    <div className="heatmap-container">
      <div className="heatmap-day-labels">
        {dayLabels.map((d, i) => (
          <span key={i} className="heatmap-day-label">{d}</span>
        ))}
      </div>
      <div className="heatmap-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="heatmap-week">
            {week.map((day, di) => (
              <div
                key={di}
                className="heatmap-cell"
                style={{ background: getColor(day.amount) }}
                title={`${day.date}: ${formatCurrency(day.amount)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="heatmap-legend">
        <span className="heatmap-legend-label">Less</span>
        <div className="heatmap-cell" style={{ background: 'var(--bg-tertiary)' }} />
        <div className="heatmap-cell" style={{ background: '#10b981' }} />
        <div className="heatmap-cell" style={{ background: '#fbbf24' }} />
        <div className="heatmap-cell" style={{ background: '#f97316' }} />
        <div className="heatmap-cell" style={{ background: '#ef4444' }} />
        <span className="heatmap-legend-label">More</span>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const {
    getInsights,
    getMonthlyData,
    getCategoryBreakdown,
    getTotalIncome,
    getTotalExpenses,
    getWeeklySpending,
    getDailyHeatmap,
    getCategoryTrends,
    getIncomeBreakdown,
    getFinancialHealthScore,
    getSpendingVelocity,
    getTopMerchants,
    getBudgetUtilization,
    getCashFlowProjection,
  } = useFinanceStore();

  const [timeRange, setTimeRange] = useState('6M');
  const [activeSection, setActiveSection] = useState('overview');

  const numMonths = timeRange === '3M' ? 3 : timeRange === '6M' ? 6 : 12;

  const insights = getInsights(numMonths);
  const monthlyData = getMonthlyData();
  const categoryBreakdown = getCategoryBreakdown(numMonths);
  const weeklySpending = getWeeklySpending(numMonths);
  const heatmapData = getDailyHeatmap(numMonths);
  const categoryTrends = getCategoryTrends(numMonths);
  const incomeBreakdown = getIncomeBreakdown(numMonths);
  const healthScore = getFinancialHealthScore(numMonths);
  const spendingVelocity = getSpendingVelocity();
  const topMerchants = getTopMerchants(numMonths);
  const budgetUtilization = getBudgetUtilization(numMonths);
  const cashFlowData = getCashFlowProjection();

  const totalIncome = getTotalIncome(numMonths);
  const totalExpenses = getTotalExpenses(numMonths);
  const netSavings = totalIncome - totalExpenses;

  // Filter monthly data based on time range
  const filteredMonthlyData = useMemo(() => {
    return monthlyData.slice(-numMonths);
  }, [monthlyData, numMonths]);

  // Radar chart data for category analysis
  const radarData = useMemo(() => {
    const maxVal = Math.max(...categoryBreakdown.map(c => c.value), 1);
    return categoryBreakdown.slice(0, 8).map(cat => ({
      category: cat.name.length > 12 ? cat.name.substring(0, 10) + '...' : cat.name,
      value: Math.round((cat.value / maxVal) * 100),
      fullMark: 100,
    }));
  }, [categoryBreakdown]);

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'spending', label: 'Spending' },
    { id: 'income', label: 'Income' },
    { id: 'budget', label: 'Budget' },
  ];

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-greeting">Analytics & <span>Insights</span></h1>
            <p className="page-subtitle">Smart analysis of your spending patterns and financial health</p>
          </div>
          <PageTabs />
        </div>
      </div>

      {/* Section Navigation */}
      <div className="analytics-section-nav">
        {sections.map(s => (
          <button
            key={s.id}
            className={`analytics-section-btn ${activeSection === s.id ? 'active' : ''}`}
            onClick={() => setActiveSection(s.id)}
          >
            {s.label}
          </button>
        ))}
        <div className="analytics-time-range">
          {['3M', '6M', '1Y'].map(r => (
            <button
              key={r}
              className={`analytics-time-btn ${timeRange === r ? 'active' : ''}`}
              onClick={() => setTimeRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ===== OVERVIEW SECTION ===== */}
      {activeSection === 'overview' && (
        <div className="analytics-content animate-in">
          {/* KPI Strip */}
          <div className="analytics-kpi-strip">
            <div className="analytics-kpi-card">
              <div className="analytics-kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <TrendingUp size={20} />
              </div>
              <div className="analytics-kpi-info">
                <span className="analytics-kpi-label">Total Income</span>
                <span className="analytics-kpi-value">{formatCurrency(totalIncome)}</span>
              </div>
              <span className="analytics-kpi-badge up">
                <ArrowUpRight size={12} /> +12.4%
              </span>
            </div>
            <div className="analytics-kpi-card">
              <div className="analytics-kpi-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                <TrendingDown size={20} />
              </div>
              <div className="analytics-kpi-info">
                <span className="analytics-kpi-label">Total Expenses</span>
                <span className="analytics-kpi-value">{formatCurrency(totalExpenses)}</span>
              </div>
              <span className="analytics-kpi-badge down">
                <ArrowUpRight size={12} /> +{Math.abs(insights.spendingChange.percent).toFixed(1)}%
              </span>
            </div>
            <div className="analytics-kpi-card">
              <div className="analytics-kpi-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                <Wallet size={20} />
              </div>
              <div className="analytics-kpi-info">
                <span className="analytics-kpi-label">Net Savings</span>
                <span className="analytics-kpi-value">{formatCurrency(netSavings)}</span>
              </div>
              <span className="analytics-kpi-badge up">
                <ArrowUpRight size={12} /> {insights.savingsRate.percent.toFixed(1)}%
              </span>
            </div>
            <div className="analytics-kpi-card">
              <div className="analytics-kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                <DollarSign size={20} />
              </div>
              <div className="analytics-kpi-info">
                <span className="analytics-kpi-label">Daily Average</span>
                <span className="analytics-kpi-value">{formatCurrency(insights.averageDailySpend)}</span>
              </div>
              <span className="analytics-kpi-badge neutral">Per Day</span>
            </div>
          </div>

          {/* Row 1: Financial Health + Income vs Expenses Chart */}
          <div className="analytics-row-2col">
            {/* Financial Health Score */}
            <div className="card analytics-card animate-in" id="financial-health">
              <div className="analytics-card-header">
                <div>
                  <h3 className="analytics-card-title">Financial Health</h3>
                  <p className="analytics-card-subtitle">Overall score based on your habits</p>
                </div>
                <div className="analytics-card-badge">
                  <Shield size={14} />
                  Score
                </div>
              </div>
              <div className="health-score-container">
                <HealthScoreRing score={healthScore} />
                <div className="health-metrics">
                  <div className="health-metric">
                    <div className="health-metric-row">
                      <span className="health-metric-label">Savings Rate</span>
                      <span className="health-metric-value">{insights.savingsRate.percent.toFixed(1)}%</span>
                    </div>
                    <div className="health-metric-bar">
                      <div className="health-metric-fill" style={{ width: `${Math.min(insights.savingsRate.percent * 2, 100)}%`, background: insights.savingsRate.percent > 20 ? '#10b981' : '#f59e0b' }} />
                    </div>
                  </div>
                  <div className="health-metric">
                    <div className="health-metric-row">
                      <span className="health-metric-label">Spending Trend</span>
                      <span className="health-metric-value" style={{ color: insights.spendingChange.increased ? '#ef4444' : '#10b981' }}>
                        {insights.spendingChange.increased ? '↑' : '↓'} {Math.abs(insights.spendingChange.percent).toFixed(1)}%
                      </span>
                    </div>
                    <div className="health-metric-bar">
                      <div className="health-metric-fill" style={{ width: `${Math.min(Math.abs(insights.spendingChange.percent) * 2, 100)}%`, background: insights.spendingChange.increased ? '#ef4444' : '#10b981' }} />
                    </div>
                  </div>
                  <div className="health-metric">
                    <div className="health-metric-row">
                      <span className="health-metric-label">Categories Active</span>
                      <span className="health-metric-value">{insights.totalCategories}</span>
                    </div>
                    <div className="health-metric-bar">
                      <div className="health-metric-fill" style={{ width: `${Math.min(insights.totalCategories * 10, 100)}%`, background: '#6366f1' }} />
                    </div>
                  </div>
                  <div className="health-metric">
                    <div className="health-metric-row">
                      <span className="health-metric-label">Budget Compliance</span>
                      <span className="health-metric-value">
                        {budgetUtilization.filter(b => b.status === 'good').length}/{budgetUtilization.length}
                      </span>
                    </div>
                    <div className="health-metric-bar">
                      <div className="health-metric-fill" style={{ 
                        width: `${budgetUtilization.length > 0 ? (budgetUtilization.filter(b => b.status === 'good').length / budgetUtilization.length) * 100 : 0}%`, 
                        background: '#10b981' 
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cash Flow Chart */}
            <div className="card analytics-card analytics-card-wide animate-in" id="cashflow-chart">
              <div className="analytics-card-header">
                <div>
                  <h3 className="analytics-card-title">Cash Flow Projection</h3>
                  <p className="analytics-card-subtitle">Income vs Expenses with 3-month forecast</p>
                </div>
                <div className="analytics-card-badge">
                  <Activity size={14} />
                  Forecast
                </div>
              </div>
              <div style={{ width: '100%', height: 300, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={300} debounce={50}>
                  <ComposedChart data={cashFlowData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickFormatter={formatMonth}
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<ChartTooltip formatLabel={formatMonth} />} />
                    <Area
                      type="monotone"
                      dataKey="income"
                      name="Income"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#incomeGrad)"
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: '#10b981' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      name="Expenses"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fill="url(#expenseGrad)"
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: '#ef4444' }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="cashflow-legend">
                <div className="cashflow-legend-item">
                  <span className="legend-dot" style={{ background: '#10b981' }} />
                  <span>Income</span>
                </div>
                <div className="cashflow-legend-item">
                  <span className="legend-dot" style={{ background: '#ef4444' }} />
                  <span>Expenses</span>
                </div>
                <div className="cashflow-legend-item projected">
                  <span className="legend-dot" style={{ background: '#94a3b8', border: '2px dashed #94a3b8' }} />
                  <span>Projected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Spending Heatmap */}
          <div className="card analytics-card analytics-card-full animate-in" id="spending-heatmap">
            <div className="analytics-card-header">
              <div>
                <h3 className="analytics-card-title">Spending Activity</h3>
                <p className="analytics-card-subtitle">Daily spending intensity over the last 90 days</p>
              </div>
              <div className="analytics-card-badge">
                <Flame size={14} />
                Heatmap
              </div>
            </div>
            <SpendingHeatmap data={heatmapData} />
          </div>

          {/* Row 3: Insight Cards (original 6) */}
          <div className="analytics-insights-grid">
            {[
              {
                id: 'highest-spending',
                title: 'Highest Spending',
                value: insights.highestCategory.name,
                desc: `${formatCurrency(insights.highestCategory.amount)} · ${insights.highestCategory.percent.toFixed(1)}% of expenses`,
                icon: PieChartIcon, variant: 'danger',
                badge: formatCurrency(insights.highestCategory.amount),
              },
              {
                id: 'monthly-trend',
                title: 'Monthly Trend',
                value: `${Math.abs(insights.spendingChange.percent).toFixed(1)}%`,
                desc: insights.spendingChange.increased
                  ? `Spending up vs ${formatFullMonth(insights.spendingChange.previousMonth)}`
                  : `Spending down vs ${formatFullMonth(insights.spendingChange.previousMonth)}`,
                icon: insights.spendingChange.increased ? TrendingUp : TrendingDown,
                variant: insights.spendingChange.increased ? 'warning' : 'success',
                badge: insights.spendingChange.increased ? '↑ Up' : '↓ Down',
              },
              {
                id: 'savings-rate',
                title: 'Savings Rate',
                value: `${insights.savingsRate.percent.toFixed(1)}%`,
                desc: insights.savingsRate.percent > 20 ? 'Excellent savings discipline' : 'Aim for 20%+ of income',
                icon: Target,
                variant: insights.savingsRate.percent > 20 ? 'success' : 'warning',
                badge: insights.savingsRate.percent > 20 ? 'Great' : 'Improve',
              },
              {
                id: 'daily-avg',
                title: 'Daily Average',
                value: formatCurrency(insights.averageDailySpend),
                desc: 'Average daily expenditure this month',
                icon: DollarSign, variant: 'info',
                badge: 'Per Day',
              },
              {
                id: 'lowest-cat',
                title: 'Lowest Category',
                value: insights.lowestCategory.name,
                desc: `Only ${formatCurrency(insights.lowestCategory.amount)} spent`,
                icon: Zap, variant: 'success',
                badge: formatCurrency(insights.lowestCategory.amount),
              },
              {
                id: 'active-cats',
                title: 'Active Categories',
                value: insights.totalCategories,
                desc: `Spending across ${insights.totalCategories} categories`,
                icon: BarChart3, variant: 'info',
                badge: `${insights.totalCategories} Total`,
              },
            ].map((card) => {
              const Icon = card.icon;
              const iconColors = {
                danger: { color: '#ef4444', bg: 'var(--danger-bg)' },
                warning: { color: '#f59e0b', bg: 'var(--warning-bg)' },
                success: { color: '#10b981', bg: 'var(--success-bg)' },
                info: { color: '#3b82f6', bg: 'var(--info-bg)' },
              };
              const c = iconColors[card.variant];
              return (
                <div key={card.id} className={`analytics-insight-card ${card.variant}`}>
                  <div className="analytics-insight-top">
                    <div className="analytics-insight-icon" style={{ background: c.bg, color: c.color }}>
                      <Icon size={18} />
                    </div>
                    <span className="analytics-insight-badge" style={{ background: c.bg, color: c.color }}>
                      {card.badge}
                    </span>
                  </div>
                  <div className="analytics-insight-label">{card.title}</div>
                  <div className="analytics-insight-value">{card.value}</div>
                  <p className="analytics-insight-desc">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== SPENDING SECTION ===== */}
      {activeSection === 'spending' && (
        <div className="analytics-content animate-in">
          {/* Weekly Spending Bar Chart */}
          <div className="analytics-row-2col">
            <div className="card analytics-card analytics-card-wide animate-in" id="weekly-spending">
              <div className="analytics-card-header">
                <div>
                  <h3 className="analytics-card-title">Weekly Spending</h3>
                  <p className="analytics-card-subtitle">Income vs expenses over the last 12 weeks</p>
                </div>
              </div>
              <div style={{ width: '100%', height: 300, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={300} debounce={50}>
                  <BarChart data={weeklySpending} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                    <XAxis
                      dataKey="week"
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
                    <Bar dataKey="expenses" name="Expenses" fill="#f97316" radius={[4, 4, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Radar */}
            <div className="card analytics-card animate-in" id="category-radar">
              <div className="analytics-card-header">
                <div>
                  <h3 className="analytics-card-title">Category Analysis</h3>
                  <p className="analytics-card-subtitle">Spending distribution radar</p>
                </div>
              </div>
              <div style={{ width: '100%', height: 300, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={300} debounce={50}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border-light)" />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="Spending"
                      dataKey="value"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Spending Velocity */}
          <div className="card analytics-card analytics-card-full animate-in" id="spending-velocity">
            <div className="analytics-card-header">
              <div>
                <h3 className="analytics-card-title">Spending Velocity</h3>
                <p className="analytics-card-subtitle">Cumulative spending this month vs last month</p>
              </div>
              <div className="analytics-card-badge">
                <Activity size={14} />
                Pace
              </div>
            </div>
            <div style={{ width: '100%', height: 280, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={280} debounce={50}>
                <AreaChart data={spendingVelocity.slice(0, 28)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="velCurrentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(d) => `Day ${d}`}
                    interval={3}
                  />
                  <YAxis
                    tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip formatLabel={(d) => `Day ${d}`} />} />
                  <Area
                    type="monotone"
                    dataKey="prevAmount"
                    name="Last Month"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="none"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    name="This Month"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#velCurrentGrad)"
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: '#6366f1' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Merchants */}
          <div className="card analytics-card analytics-card-full animate-in" id="top-merchants">
            <div className="analytics-card-header">
              <div>
                <h3 className="analytics-card-title">Top Merchants</h3>
                <p className="analytics-card-subtitle">Where your money goes most frequently</p>
              </div>
              <div className="analytics-card-badge">
                <CreditCard size={14} />
                All Time
              </div>
            </div>
            <div className="merchants-table">
              <div className="merchants-header">
                <span>Merchant</span>
                <span>Category</span>
                <span>Frequency</span>
                <span>Total Amount</span>
              </div>
              {topMerchants.map((m, i) => (
                <div key={i} className="merchants-row">
                  <div className="merchant-name">
                    <span className="merchant-rank">#{i + 1}</span>
                    {m.name}
                  </div>
                  <div className="merchant-category">
                    <span className="merchant-cat-dot" style={{ background: categoryColors[m.category] || '#94a3b8' }} />
                    {m.category}
                  </div>
                  <div className="merchant-count">{m.count}x</div>
                  <div className="merchant-amount">{formatCurrency(m.totalAmount)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== INCOME SECTION ===== */}
      {activeSection === 'income' && (
        <div className="analytics-content animate-in">
          <div className="analytics-row-2col">
            {/* Income Breakdown Donut */}
            <div className="card analytics-card animate-in" id="income-breakdown">
              <div className="analytics-card-header">
                <div>
                  <h3 className="analytics-card-title">Income Sources</h3>
                  <p className="analytics-card-subtitle">Revenue breakdown by category</p>
                </div>
              </div>
              <div style={{ position: 'relative', width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={260} debounce={50}>
                  <PieChart>
                    <Pie
                      data={incomeBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {incomeBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={categoryColors[entry.name] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center-label">
                  <div className="donut-center-sub">Total</div>
                  <div className="donut-center-value">{formatCurrency(totalIncome)}</div>
                </div>
              </div>
              <div className="income-source-list">
                {incomeBreakdown.map((source) => (
                  <div key={source.name} className="income-source-item">
                    <div className="income-source-left">
                      <span className="income-source-dot" style={{ background: categoryColors[source.name] || '#94a3b8' }} />
                      <span className="income-source-name">{source.name}</span>
                    </div>
                    <div className="income-source-right">
                      <span className="income-source-value">{formatCurrency(source.value)}</span>
                      <span className="income-source-pct">{source.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Income Trend */}
            <div className="card analytics-card analytics-card-wide animate-in" id="income-trend">
              <div className="analytics-card-header">
                <div>
                  <h3 className="analytics-card-title">Income Trend</h3>
                  <p className="analytics-card-subtitle">Monthly income with savings overlay</p>
                </div>
              </div>
              <div style={{ width: '100%', height: 300, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={300} debounce={50}>
                  <ComposedChart data={filteredMonthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickFormatter={formatMonth}
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<ChartTooltip formatLabel={formatMonth} />} />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} fillOpacity={0.8} />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      name="Savings"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Income vs Expenses Summary Cards */}
          <div className="analytics-summary-row">
            {filteredMonthlyData.slice(-4).map((m) => {
              const savings = m.income - m.expenses;
              const savingsRate = m.income > 0 ? (savings / m.income * 100) : 0;
              return (
                <div key={m.month} className="card analytics-month-card animate-in">
                  <div className="analytics-month-label">{formatFullMonth(m.month)}</div>
                  <div className="analytics-month-row">
                    <div>
                      <div className="analytics-month-sublabel">Income</div>
                      <div className="analytics-month-value income">{formatCurrency(m.income)}</div>
                    </div>
                    <div>
                      <div className="analytics-month-sublabel">Expenses</div>
                      <div className="analytics-month-value expense">{formatCurrency(m.expenses)}</div>
                    </div>
                    <div>
                      <div className="analytics-month-sublabel">Saved</div>
                      <div className={`analytics-month-value ${savings >= 0 ? 'income' : 'expense'}`}>
                        {formatCurrency(savings)}
                      </div>
                    </div>
                  </div>
                  <div className="analytics-month-bar">
                    <div className="analytics-month-bar-fill" style={{ width: `${Math.min(savingsRate, 100)}%`, background: savingsRate > 20 ? '#10b981' : savingsRate > 0 ? '#f59e0b' : '#ef4444' }} />
                  </div>
                  <div className="analytics-month-rate">{savingsRate.toFixed(1)}% saved</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== BUDGET SECTION ===== */}
      {activeSection === 'budget' && (
        <div className="analytics-content animate-in">
          {/* Budget Utilization */}
          <div className="card analytics-card analytics-card-full animate-in" id="budget-utilization">
            <div className="analytics-card-header">
              <div>
                <h3 className="analytics-card-title">Budget Utilization</h3>
                <p className="analytics-card-subtitle">Monthly average spending vs allocated budgets</p>
              </div>
              <div className="analytics-card-badge">
                <Target size={14} />
                Monthly Avg
              </div>
            </div>
            <div className="budget-grid">
              {budgetUtilization.map((item) => (
                <div key={item.name} className={`budget-item ${item.status}`}>
                  <div className="budget-item-header">
                    <div className="budget-item-left">
                      <span className="budget-cat-dot" style={{ background: categoryColors[item.name] || '#94a3b8' }} />
                      <span className="budget-cat-name">{item.name}</span>
                    </div>
                    <div className="budget-item-right">
                      {item.status === 'over' && <AlertTriangle size={14} className="budget-status-icon over" />}
                      {item.status === 'warning' && <AlertTriangle size={14} className="budget-status-icon warning" />}
                      {item.status === 'good' && <CheckCircle2 size={14} className="budget-status-icon good" />}
                    </div>
                  </div>
                  <div className="budget-amounts">
                    <span className="budget-spent">{formatCurrency(item.spent)}</span>
                    <span className="budget-divider">/</span>
                    <span className="budget-limit">{formatCurrency(item.budget)}</span>
                  </div>
                  <div className="budget-bar-container">
                    <div
                      className={`budget-bar-fill ${item.status}`}
                      style={{
                        width: `${Math.min(item.utilization, 100)}%`,
                      }}
                    />
                    {item.utilization > 100 && (
                      <div className="budget-bar-overflow" style={{ width: `${Math.min(item.utilization - 100, 30)}%` }} />
                    )}
                  </div>
                  <div className="budget-utilization-pct">
                    <span className={`budget-pct ${item.status}`}>{item.utilization}%</span>
                    <span className="budget-pct-label">utilized</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Trends Stacked Bar */}
          <div className="card analytics-card analytics-card-full animate-in" id="category-trends">
            <div className="analytics-card-header">
              <div>
                <h3 className="analytics-card-title">Category Trends</h3>
                <p className="analytics-card-subtitle">How each expense category changes over time</p>
              </div>
            </div>
            <div style={{ width: '100%', height: 320, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={320} debounce={50}>
                <BarChart data={categoryTrends.slice(-6)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={formatMonth}
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip formatLabel={formatMonth} />} />
                  {categoryBreakdown.slice(0, 6).map((cat) => (
                    <Bar
                      key={cat.name}
                      dataKey={cat.name}
                      name={cat.name}
                      stackId="a"
                      fill={categoryColors[cat.name] || '#94a3b8'}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="category-trend-legend">
              {categoryBreakdown.slice(0, 6).map((cat) => (
                <div key={cat.name} className="category-trend-legend-item">
                  <span className="legend-dot" style={{ background: categoryColors[cat.name] || '#94a3b8' }} />
                  <span>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown Donut for Expenses */}
          <div className="analytics-row-2col">
            <div className="card analytics-card animate-in" id="expense-breakdown">
              <div className="analytics-card-header">
                <div>
                  <h3 className="analytics-card-title">Expense Breakdown</h3>
                  <p className="analytics-card-subtitle">All-time spending by category</p>
                </div>
              </div>
              <div style={{ position: 'relative', width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={260} debounce={50}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={categoryColors[entry.name] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center-label">
                  <div className="donut-center-sub">Total</div>
                  <div className="donut-center-value">{formatCurrency(totalExpenses)}</div>
                </div>
              </div>
              <div className="income-source-list">
                {categoryBreakdown.slice(0, 5).map((cat) => {
                  const pct = totalExpenses > 0 ? ((cat.value / totalExpenses) * 100).toFixed(1) : '0';
                  return (
                    <div key={cat.name} className="income-source-item">
                      <div className="income-source-left">
                        <span className="income-source-dot" style={{ background: categoryColors[cat.name] || '#94a3b8' }} />
                        <span className="income-source-name">{cat.name}</span>
                      </div>
                      <div className="income-source-right">
                        <span className="income-source-value">{formatCurrency(cat.value)}</span>
                        <span className="income-source-pct">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Comparison Bar */}
            <div className="card analytics-card analytics-card-wide animate-in" id="monthly-comparison">
              <div className="analytics-card-header">
                <div>
                  <h3 className="analytics-card-title">Monthly Comparison</h3>
                  <p className="analytics-card-subtitle">Income, expenses and net savings by month</p>
                </div>
              </div>
              <div style={{ width: '100%', height: 300, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={300} debounce={50}>
                  <BarChart data={filteredMonthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickFormatter={formatMonth}
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<ChartTooltip formatLabel={formatMonth} />} />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={18} />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={18} />
                    <Bar dataKey="balance" name="Net Savings" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

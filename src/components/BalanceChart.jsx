import { useState } from 'react';
import { Calendar, ArrowUpRight } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import useFinanceStore from '../store/useFinanceStore';

const monthNames = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
};

const formatLabel = (label, period) => {
  if (period === 'Weekly' || period === 'Monthly') return label;
  const parts = label.split('-');
  return monthNames[parts[1]] || label;
};

const CustomTooltip = ({ active, payload, label, period }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '14px 18px',
      boxShadow: 'var(--shadow-lg)',
      minWidth: '160px',
    }}>
      <p style={{
        fontWeight: 700,
        fontSize: '0.8125rem',
        color: 'var(--text-primary)',
        marginBottom: '10px',
      }}>
        {formatLabel(label, period)}
      </p>
      {payload.map((entry, index) => (
        <div key={index} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '4px',
        }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: entry.color,
              display: 'inline-block',
            }} />
            {entry.name}
          </span>
          <span style={{
            fontWeight: 700,
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
          }}>
            ${entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function BalanceChart() {
  const { getChartData } = useFinanceStore();
  const [period, setPeriod] = useState('Yearly');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const chartData = getChartData(period);

  const avgIncome = Math.round(chartData.reduce((s, m) => s + m.income, 0) / (chartData.length || 1));
  const avgExpenses = Math.round(chartData.reduce((s, m) => s + m.expenses, 0) / (chartData.length || 1));

  return (
    <div className="card animate-in" id="statistics-chart" style={{ padding: '24px' }}>
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Statistics</h3>
          <div className="chart-legend" style={{ marginTop: 8, marginBottom: 0 }}>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#10b981' }} />
              Total Income
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#f97316' }} />
              Total Expenses
            </div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <button 
            className="chart-toggle" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Calendar size={14} />
            {period}
          </button>
          
          {isDropdownOpen && (
            <div className="chart-dropdown" style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 100,
              minWidth: '120px',
              overflow: 'hidden'
            }}>
              {['Weekly', 'Monthly', 'Yearly'].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    setIsDropdownOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    textAlign: 'left',
                    background: period === p ? 'var(--bg-tertiary)' : 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.target.style.background = period === p ? 'var(--bg-tertiary)' : 'transparent'}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ width: '100%', height: 300, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={300} debounce={50}>
          <AreaChart data={chartData || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-light)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tickFormatter={(v) => formatLabel(v, period)}
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip period={period} />} />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#incomeGradient)"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 3, stroke: '#fff', fill: '#10b981' }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#expenseGradient)"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 3, stroke: '#fff', fill: '#f97316' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Average stats below chart */}
      <div className="avg-stats-row" style={{ marginTop: 20, marginBottom: 0 }}>
        <div className="avg-stat-card" style={{
          padding: '16px 20px',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
        }}>
          <div className="stat-label">Average Income</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            ${avgIncome.toLocaleString()}
          </div>
          <div className="stat-compare">
            <span className="compare-badge up" style={{ fontSize: '0.6875rem' }}>
              <ArrowUpRight size={11} /> +9.8%
            </span>
            <span className="compare-text">vs last {period.toLowerCase()}</span>
          </div>
        </div>
        <div className="avg-stat-card" style={{
          padding: '16px 20px',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
        }}>
          <div className="stat-label">Average Expenses</div>
          <div className="stat-value" style={{ color: 'var(--orange)' }}>
            ${avgExpenses.toLocaleString()}
          </div>
          <div className="stat-compare">
            <span className="compare-badge down" style={{ fontSize: '0.6875rem' }}>
              <ArrowUpRight size={11} /> +8.7%
            </span>
            <span className="compare-text">vs last {period.toLowerCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

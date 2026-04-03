import { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { ArrowRight } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';
import { categoryColors } from '../data/transactions';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '10px',
      padding: '10px 14px',
      boxShadow: 'var(--shadow-md)',
    }}>
      <p style={{ fontWeight: 700, fontSize: '0.8125rem', color: data.payload.fill }}>
        {data.name}
      </p>
      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
        ${data.value.toLocaleString()}
      </p>
    </div>
  );
};

const RADIAN = Math.PI / 180;

export default function SpendingPieChart() {
  const { getCategoryBreakdown, getTotalExpenses } = useFinanceStore();
  const categoryData = getCategoryBreakdown();
  const totalExpenses = getTotalExpenses();

  const topCategories = categoryData.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Donut Chart Card */}
      <div className="card animate-in" id="spending-chart">
        <div className="chart-header" style={{ marginBottom: 12 }}>
          <h3 className="chart-title">All Expenses</h3>
        </div>

        <div style={{ position: 'relative', width: '100%', height: 200 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={200} debounce={50}>
            <PieChart>
              <Pie
                data={categoryData || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                animationBegin={100}
                animationDuration={900}
              >
                {categoryData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={categoryColors[entry.name] || '#94a3b8'}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
              Total
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              ${Math.round(totalExpenses).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Category list */}
        <div className="spending-category-list" style={{ marginTop: 12 }}>
          {topCategories.map((cat) => {
            const pct = totalExpenses > 0 ? ((cat.value / totalExpenses) * 100).toFixed(0) : 0;
            return (
              <div className="spending-cat-item" key={cat.name}>
                <div className="spending-cat-left">
                  <span className="spending-cat-dot" style={{ background: categoryColors[cat.name] || '#94a3b8' }} />
                  <span className="spending-cat-name">{cat.name}</span>
                </div>
                <span className="spending-cat-pct">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="promo-banner animate-in">
        <h3>Secure Your Future with Our Comprehensive Retirement Plans!</h3>
        <button className="promo-btn">
          Learn more <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

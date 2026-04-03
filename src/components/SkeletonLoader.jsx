export default function SkeletonLoader({ type = 'card' }) {
  if (type === 'summary') {
    return (
      <div className="summary-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>
    );
  }

  if (type === 'charts') {
    return (
      <div className="charts-section">
        <div className="skeleton skeleton-chart" />
        <div className="skeleton skeleton-chart" />
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton skeleton-row" />
        ))}
      </div>
    );
  }

  if (type === 'insights') {
    return (
      <div className="insights-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton" style={{ height: 180, borderRadius: 'var(--radius-xl)' }} />
        ))}
      </div>
    );
  }

  return <div className="skeleton skeleton-card" />;
}

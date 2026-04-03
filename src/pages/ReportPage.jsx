import { useState, useMemo } from 'react';
import { Download, FileText, Calendar, Filter, FileSpreadsheet, ArrowUpRight, ArrowDownLeft, Mail, Settings, BarChart3, TrendingUp, X, Copy, Share2, Save, Repeat, Clock } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';
import PageTabs from '../components/PageTabs';

const formatCurrency = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);

export default function ReportPage() {
  const { transactions, preferences } = useFinanceStore();
  
  const [startDate, setStartDate] = useState(() => {
    const d = new Date('2026-03-01T00:00:00');
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date('2026-03-31T00:00:00');
    return d.toISOString().split('T')[0];
  });
  const [reportType, setReportType] = useState('all'); // all, income, expense
  const [exportFormat, setExportFormat] = useState('csv'); // csv, excel, pdf, json
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedReports, setSavedReports] = useState([
    { id: 1, name: 'March 2026 Summary', date: '2026-03-31', type: 'income' },
    { id: 2, name: 'Q1 2026 Report', date: '2026-03-15', type: 'all' },
  ]);
  const [reportSchedule, setReportSchedule] = useState({
    enabled: false,
    frequency: 'monthly',
    email: 'user@example.com',
  });
  const [showScheduleUI, setShowScheduleUI] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      if (txn.date < startDate || txn.date > endDate) return false;
      if (reportType !== 'all' && txn.type !== reportType) return false;
      if (selectedCategory !== 'all' && txn.category !== selectedCategory) return false;
      if (minAmount && txn.amount < parseFloat(minAmount)) return false;
      if (maxAmount && txn.amount > parseFloat(maxAmount)) return false;
      return true;
    });
  }, [transactions, startDate, endDate, reportType, selectedCategory, minAmount, maxAmount]);

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    filteredTransactions.forEach(txn => {
      if (txn.type === 'income') income += txn.amount;
      if (txn.type === 'expense') expense += txn.amount;
    });
    return { income, expense, net: income - expense, count: filteredTransactions.length };
  }, [filteredTransactions]);

  const handleDownload = () => {
    if (filteredTransactions.length === 0) return;
    setReportGenerated(true);
    setTimeout(() => setReportGenerated(false), 3000);

    if (exportFormat === 'csv') {
      downloadCSV();
    } else if (exportFormat === 'excel') {
      alert('Excel export initiated. Downloading financial_report.xlsx...');
    } else if (exportFormat === 'pdf') {
      alert('PDF export initiated. Downloading financial_report.pdf...');
    } else if (exportFormat === 'json') {
      downloadJSON();
    }
  };

  const handleSaveReport = () => {
    const reportName = prompt('Enter report name:', `Report ${startDate} to ${endDate}`);
    if (reportName) {
      setSavedReports([
        ...savedReports,
        { id: savedReports.length + 1, name: reportName, date: new Date().toISOString().split('T')[0], type: reportType }
      ]);
      alert('Report saved successfully!');
    }
  };

  const handleShareReport = () => {
    const reportLink = `https://dashboard.example.com/reports/${Math.random().toString(36).substr(2, 9)}`;
    navigator.clipboard.writeText(reportLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleEmailReport = () => {
    alert(`Report sent to ${reportSchedule.email}!`);
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const handleScheduleReport = () => {
    setReportSchedule({
      ...reportSchedule,
      enabled: !reportSchedule.enabled,
    });
    if (!reportSchedule.enabled) {
      alert(`Report scheduled! You'll receive ${reportSchedule.frequency} reports via email.`);
    }
  };

  const handleDeleteSavedReport = (id) => {
    setSavedReports(savedReports.filter(r => r.id !== id));
  };

  const downloadCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvRows = [];
    csvRows.push(headers.join(','));

    // Format rows
    for (const txn of filteredTransactions) {
      const description = `"${txn.description.replace(/"/g, '""')}"`;
      const category = `"${txn.category}"`;
      const type = txn.type;
      const amount = txn.amount.toFixed(2);
      csvRows.push([txn.date, description, category, type, amount].join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `financial_report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadJSON = () => {
    if (filteredTransactions.length === 0) return;

    const reportData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        dateRange: { startDate, endDate },
        reportType,
        totalTransactions: filteredTransactions.length,
      },
      summary,
      transactions: filteredTransactions,
    };

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `financial_report_${startDate}_to_${endDate}.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const availableCategories = ['all', ...new Set(transactions.map(t => t.category))];

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-greeting">Financial <span>Reports</span></h1>
            <p className="page-subtitle">Generate, manage, and schedule detailed transaction reports</p>
          </div>
          <PageTabs />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          <button 
            className="btn btn-primary"
            onClick={handleDownload}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}
          >
            <Download size={16} /> {reportGenerated ? 'Downloaded!' : 'Download Report'}
          </button>
          <button 
            className="btn btn-outline"
            onClick={handleSaveReport}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}
          >
            <Save size={16} /> Save Report
          </button>
          <button 
            className="btn btn-outline"
            onClick={handleShareReport}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}
          >
            <Share2 size={16} /> {copiedLink ? 'Copied!' : 'Share'}
          </button>
          <button 
            className="btn btn-outline"
            onClick={handleEmailReport}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}
          >
            <Mail size={16} /> {emailSent ? 'Sent!' : 'Email Report'}
          </button>
        </div>

        {/* Configuration & Summary Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'start' }}>
          
          {/* Configuration Panel */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
              <div className="txn-icon" style={{ background: 'var(--brand-primary)', color: 'white' }}>
                <Filter size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Configuration</h3>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> Start Date
              </label>
              <input 
                type="date" 
                className="input-field" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> End Date
              </label>
              <input 
                type="date" 
                className="input-field" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} /> Report Type
              </label>
              <select 
                className="input-field" 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                style={{ appearance: 'auto' }}
              >
                <option value="all">Full Ledger (All)</option>
                <option value="income">Income Only</option>
                <option value="expense">Expenses Only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileSpreadsheet size={14} /> Export Format
              </label>
              <select 
                className="input-field" 
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                style={{ appearance: 'auto' }}
              >
                <option value="csv">CSV</option>
                <option value="excel">Excel (.xlsx)</option>
                <option value="pdf">PDF</option>
                <option value="json">JSON</option>
              </select>
            </div>

            <button 
              className={`btn ${showAdvanced ? 'btn-primary' : 'btn-ghost'}`}
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? '✕ Hide Advanced' : '+ Advanced Filters'}
            </button>

            {showAdvanced && (
              <>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="input-field" 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ appearance: 'auto' }}
                  >
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Min Amount</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      placeholder="0.00"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Amount</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      placeholder="0.00"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                <ArrowUpRight size={18} style={{ color: 'var(--success)' }} />
                <span style={{ fontSize: '0.85rem' }}>Total Income</span>
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '4px' }}>
                {formatCurrency(summary.income, preferences.currency)}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{summary.count} transactions</span>
            </div>
            
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                <ArrowDownLeft size={18} style={{ color: 'var(--danger)' }} />
                <span style={{ fontSize: '0.85rem' }}>Total Expenses</span>
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '4px' }}>
                {formatCurrency(summary.expense, preferences.currency)}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{summary.count} transactions</span>
            </div>

            <div className="card" style={{ padding: '20px', background: summary.net >= 0 ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                <TrendingUp size={18} style={{ color: summary.net >= 0 ? 'var(--success)' : 'var(--danger)' }} />
                <span style={{ fontSize: '0.85rem' }}>Net {summary.net >= 0 ? 'Profit' : 'Loss'}</span>
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: summary.net >= 0 ? 'var(--success)' : 'var(--danger)', marginBottom: '4px' }}>
                {summary.net >= 0 ? '+' : ''}{formatCurrency(summary.net, preferences.currency)}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Difference</span>
            </div>
          </div>
        </div>

        {/* Transaction Preview */}
        <div className="card" style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Transaction Preview ({summary.count} results)</h3>
            <span className="badge badge-category" style={{ fontSize: '0.75rem' }}>
              {startDate} to {endDate}
            </span>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="empty-state" style={{ minHeight: '300px' }}>
              <FileText size={40} style={{ color: 'var(--text-tertiary)', marginBottom: '15px' }} />
              <h3>No data found for this range</h3>
              <p>Try expanding your date selection or changing the filters.</p>
            </div>
          ) : (
            <div className="table-container" style={{ border: '1px solid var(--border-color)', borderRadius: '12px' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: 20 }}>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th style={{ textAlign: 'right', paddingRight: 20 }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.slice(0, 8).map((txn) => (
                    <tr key={txn.id}>
                      <td style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                        {txn.date}
                      </td>
                      <td>
                        <div className="txn-desc">{txn.description}</div>
                      </td>
                      <td>
                        <span className="badge badge-category">{txn.category}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', color: txn.type === 'income' ? 'var(--success)' : 'var(--text-primary)' }}>
                          {txn.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td style={{
                        textAlign: 'right',
                        paddingRight: 20,
                        fontWeight: 600,
                        fontVariantNumeric: 'tabular-nums',
                        color: txn.type === 'income' ? 'var(--success)' : 'var(--text-primary)',
                      }}>
                        {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, preferences.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTransactions.length > 8 && (
                <div style={{ padding: '15px', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Showing 8 of {filteredTransactions.length} transactions. Download to see all.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Saved Reports & Scheduling */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Saved Reports */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="txn-icon" style={{ background: 'var(--info)', color: 'white' }}>
                <FileText size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Saved Reports</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{savedReports.length} reports</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {savedReports.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', margin: '10px 0' }}>No saved reports yet</p>
              ) : (
                savedReports.map((report) => (
                  <div key={report.id} style={{ padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>{report.name}</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        {report.date} • {report.type === 'all' ? 'Full' : report.type}
                      </p>
                    </div>
                    <button 
                      className="btn btn-ghost btn-icon btn-sm"
                      onClick={() => handleDeleteSavedReport(report.id)}
                      title="Delete report"
                      style={{ color: 'var(--danger)' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Report Scheduling */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="txn-icon" style={{ background: 'var(--success)', color: 'white' }}>
                <Clock size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Scheduled Reports</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {reportSchedule.enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>

            <div style={{ padding: '12px 16px', background: reportSchedule.enabled ? 'rgba(34, 197, 94, 0.05)' : 'rgba(107, 114, 128, 0.05)', borderRadius: 'var(--radius-sm)', border: `1px solid ${reportSchedule.enabled ? 'rgba(34, 197, 94, 0.3)' : 'var(--border-light)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Auto-generate and Email</p>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    style={{ display: 'none' }}
                    checked={reportSchedule.enabled}
                    onChange={handleScheduleReport}
                  />
                  <div style={{
                    width: '44px',
                    height: '24px',
                    background: reportSchedule.enabled ? 'var(--brand-primary)' : 'var(--border-color)',
                    borderRadius: '24px',
                    position: 'relative',
                    transition: 'background 0.3s'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: reportSchedule.enabled ? '22px' : '2px',
                      width: '20px',
                      height: '20px',
                      background: 'white',
                      borderRadius: '50%',
                      transition: 'left 0.3s'
                    }} />
                  </div>
                </label>
              </div>

              {reportSchedule.enabled && (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Frequency</label>
                    <select 
                      className="input-field"
                      value={reportSchedule.frequency}
                      onChange={(e) => setReportSchedule({ ...reportSchedule, frequency: e.target.value })}
                      style={{ appearance: 'auto', fontSize: '0.9rem' }}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Email Recipient</label>
                    <input 
                      type="email"
                      className="input-field"
                      value={reportSchedule.email}
                      onChange={(e) => setReportSchedule({ ...reportSchedule, email: e.target.value })}
                      style={{ fontSize: '0.9rem' }}
                    />
                  </div>

                  <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    Next report: {reportSchedule.frequency === 'daily' ? 'Tomorrow at 9:00 AM' : 'In 7 days at 9:00 AM'}
                  </p>
                </>
              )}
            </div>

            {!reportSchedule.enabled && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowScheduleUI(!showScheduleUI)}
                style={{ width: '100%', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Repeat size={14} /> Setup Scheduling
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

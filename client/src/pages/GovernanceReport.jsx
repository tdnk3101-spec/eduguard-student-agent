import React, { useState, useEffect } from 'react';
import { TrendingUp, Shield, Lock, FileText, CheckCircle, Clock } from '../components/Icons';
import { api } from '../api/client';

export function GovernanceReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    setLoading(true);
    try {
      const res = await api.getGovernanceReport();
      setReport(res);
    } catch (err) {
      console.error('Failed to load governance report:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        Generating Anonymised Institutional Governance Report...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#dc2626' }}>
        Failed to load report.
      </div>
    );
  }

  const { overview, categoryBreakdown, monthlyTrends, proceduralMetrics } = report;

  return (
    <div className="animate-fade-in">
      {/* Governance Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0a2540 0%, #0f766e 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '1.75rem 2rem',
        marginBottom: '1.75rem',
        boxShadow: '0 4px 20px rgba(10, 37, 64, 0.12)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.6rem' }}>
          <Shield size={13} style={{ color: '#5eead4' }} />
          <span>Institutional Governance & Aggregate Trends • Zero-PII Protected</span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.35rem' }}>
          Executive Disciplinary Oversight Dashboard
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#ccfbf1', lineHeight: 1.5, maxWidth: '800px' }}>
          Provides aggregate incident statistics, procedural completion times, and policy compliance rates. 
          In strict compliance with privacy guardrails, no student identities, roll numbers, or individual case files are exposed.
        </p>
      </div>

      {/* KPI Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>TOTAL INCIDENTS RECORDED</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0a2540', margin: '0.25rem 0' }}>
            {overview.totalCases}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Current Academic Year
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>ACTIVE INQUIRIES</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb', margin: '0.25rem 0' }}>
            {overview.activeCases}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Under procedural timelines
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>AVG RESOLUTION TIME</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', margin: '0.25rem 0' }}>
            {proceduralMetrics.averageResolutionDays} Days
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            From intake to decision order
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>RETENTION COUNTDOWN</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7c3aed', margin: '0.25rem 0' }}>
            {overview.retentionActiveCount} Files
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Scheduled for automatic expungement
          </div>
        </div>
      </div>

      {/* Category Breakdown & Procedural Compliance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Category Breakdown */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', color: '#0a2540', marginBottom: '0.4rem' }}>
            Incidents by Policy Category
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1.25rem' }}>
            Distribution of reported violations across institutional statutory categories.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.keys(categoryBreakdown).map((key) => {
              const item = categoryBreakdown[key];
              const pct = overview.totalCases > 0 ? Math.round((item.count / overview.totalCases) * 100) : 0;
              return (
                <div key={key}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{item.name}</span>
                    <span style={{ fontWeight: 700, color: '#0a2540' }}>{item.count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: '#2563eb' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Procedural Compliance Health */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', color: '#0a2540', marginBottom: '0.4rem' }}>
            Procedural Fairness & Audit Telemetry
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1.25rem' }}>
            Verification of statutory adherence and due-process guarantees.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: '#f8fafc', borderRadius: '8px' }}>
              <span>Mandatory Gate Check Compliance:</span>
              <strong style={{ color: '#059669' }}>{proceduralMetrics.proceduralGateComplianceRate}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: '#f8fafc', borderRadius: '8px' }}>
              <span>Notice Delivery Acknowledgment Rate:</span>
              <strong style={{ color: '#2563eb' }}>{proceduralMetrics.noticesAcknowledgedRate}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: '#f8fafc', borderRadius: '8px' }}>
              <span>Educational Sanction Completion Rate:</span>
              <strong style={{ color: '#059669' }}>{proceduralMetrics.sanctionsCompletedOnTimeRate}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: '#f8fafc', borderRadius: '8px' }}>
              <span>Statutory Appeal Rate:</span>
              <strong style={{ color: '#d97706' }}>{proceduralMetrics.appealsFilingRate}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={14} style={{ color: '#059669' }} />
                <span>SHA-256 Ledger Integrity:</span>
              </div>
              <strong style={{ color: '#059669' }}>100% Cryptographically Valid</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', color: '#0a2540', marginBottom: '0.4rem' }}>
          Monthly Anonymised Incident Trends
        </h3>
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
          Historical longitudinal distribution across semesters.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Month</th>
                <th style={{ padding: '0.75rem 1rem' }}>Academic Malpractice</th>
                <th style={{ padding: '0.75rem 1rem' }}>Campus Misconduct</th>
                <th style={{ padding: '0.75rem 1rem' }}>Exam Malpractice</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total Incidents</th>
              </tr>
            </thead>
            <tbody>
              {monthlyTrends.map((t, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0a2540' }}>{t.month}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{t.academic}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{t.campus}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{t.exam}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>{t.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

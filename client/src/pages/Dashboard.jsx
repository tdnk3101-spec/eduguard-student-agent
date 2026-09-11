import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Shield, Scale, Clock, Lock, CheckCircle, ChevronRight, FileText, Bot } from '../components/Icons';
import { StatusBadge, CategoryBadge } from '../components/StatusBadge';
import { api } from '../api/client';

export function Dashboard({ onSelectCase, onOpenIntake, onOpenSandbox, onOpenHashChain }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadCases();
  }, [categoryFilter, statusFilter, search]);

  async function loadCases() {
    setLoading(true);
    try {
      const res = await api.getCases({
        category: categoryFilter,
        status: statusFilter,
        search
      });
      setCases(res.cases || []);
    } catch (err) {
      console.error('Error fetching cases:', err);
    } finally {
      setLoading(false);
    }
  }

  // Calculate metrics
  const totalCount = cases.length;
  const noticeActive = cases.filter(c => c.status === 'NOTICE_ISSUED' || c.status === 'INCIDENT_REGISTERED').length;
  const committeeActive = cases.filter(c => c.status === 'RESPONSE_RECEIVED' || c.status === 'HEARING_CONVENED').length;
  const sanctionActive = cases.filter(c => c.status === 'SANCTION_IN_PROGRESS').length;
  const closedCount = cases.filter(c => c.status === 'CLOSED_RETENTION_ACTIVE' || c.status === 'DISMISSED_EXONERATED').length;

  return (
    <div className="animate-fade-in">
      {/* Top Banner Notice */}
      <div style={{
        background: 'linear-gradient(135deg, #0a2540 0%, #1e3a8a 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '1.75rem 2rem',
        marginBottom: '1.75rem',
        boxShadow: '0 4px 20px rgba(10, 37, 64, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ maxWidth: '750px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.6rem' }}>
            <Shield size={13} style={{ color: '#60a5fa' }} />
            <span>EduGuard • Disciplinary Records & Due Process Custodian</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.4rem' }}>
            Institutional Disciplinary Case Register
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            Maintains procedural compliance and record-keeping under approved institutional policies. 
            Guarantees strict guilt-neutrality, policy-bound checklists, and SHA-256 tamper-evident logs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={onOpenIntake} style={{ background: '#ffffff', color: '#0a2540' }}>
            <Plus size={16} /> New Case File
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.78rem', fontWeight: 600 }}>
            <span>TOTAL CASES</span>
            <FileText size={16} style={{ color: '#2563eb' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0a2540', margin: '0.25rem 0' }}>
            {totalCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Across all 5 policy categories
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.78rem', fontWeight: 600 }}>
            <span>NOTICE & RESPONSE WINDOWS</span>
            <Clock size={16} style={{ color: '#d97706' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', margin: '0.25rem 0' }}>
            {noticeActive}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Statutory reply periods active
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.78rem', fontWeight: 600 }}>
            <span>COMMITTEE HEARINGS</span>
            <Scale size={16} style={{ color: '#7c3aed' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7c3aed', margin: '0.25rem 0' }}>
            {committeeActive}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Awaiting quorum & deliberation
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.78rem', fontWeight: 600 }}>
            <span>SANCTION COMPLIANCE</span>
            <Clock size={16} style={{ color: '#2563eb' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb', margin: '0.25rem 0' }}>
            {sanctionActive}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Service / restitution in progress
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.78rem', fontWeight: 600 }}>
            <span>CLOSED & PURGE TIMER</span>
            <Lock size={16} style={{ color: '#16a34a' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a', margin: '0.25rem 0' }}>
            {closedCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Retention countdown active
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.45rem 0.8rem', minWidth: '300px' }}>
            <Search size={16} style={{ color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by Case ID, Student Roll, Name, or Allegation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem' }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Category:</span>
              <select
                className="form-select"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', width: 'auto' }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="ACADEMIC_MALPRACTICE">Academic Malpractice</option>
                <option value="CAMPUS_MISCONDUCT">Hostel & Campus Misconduct</option>
                <option value="ANTI_RAGGING_HARASSMENT">Anti-Ragging / Harassment</option>
                <option value="EXAMINATION_INFRACTION">Exam Malpractice</option>
                <option value="SUBSTANCE_ABUSE_VIOLATION">Substance Abuse</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Status:</span>
              <select
                className="form-select"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', width: 'auto' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="INCIDENT_REGISTERED">Incident Registered</option>
                <option value="NOTICE_ISSUED">Notice Dispatched</option>
                <option value="RESPONSE_RECEIVED">Response Recorded</option>
                <option value="HEARING_CONVENED">Hearing Convened</option>
                <option value="SANCTION_IN_PROGRESS">Sanction Active</option>
                <option value="CLOSED_RETENTION_ACTIVE">Closed (Retention Active)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Case Register Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#0a2540' }}>Case Docket Register</h3>
            <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
              {cases.length} Records
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Click any row to open the complete 9-Stage Case File
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Loading case files...
          </div>
        ) : cases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            No disciplinary cases matched your search or filters.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Case ID</th>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Student (Roll No)</th>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Offence Category</th>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Procedural Status</th>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Stage Progress</th>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Incident Date</th>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr
                    key={c.caseId}
                    onClick={() => onSelectCase(c.caseId)}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                  >
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#0a2540', fontFamily: 'var(--font-mono)' }}>
                      {c.caseNumber}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{c.studentName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{c.studentRoll} • {c.studentDept}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <CategoryBadge category={c.category} />
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <StatusBadge status={c.status} />
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          flex: 1,
                          height: '6px',
                          background: '#e2e8f0',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                          minWidth: '70px'
                        }}>
                          <div style={{
                            width: `${(c.stage / 9) * 100}%`,
                            height: '100%',
                            background: c.stage >= 8 ? '#16a34a' : '#2563eb'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>
                          {c.stage}/9
                        </span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.2rem' }}>
                        {c.stageName}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#64748b' }}>
                      {new Date(c.incidentDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.5rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenHashChain(c.caseId);
                          }}
                          title="Inspect SHA-256 Hash Chain"
                        >
                          <Lock size={13} style={{ color: '#2563eb' }} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCase(c.caseId);
                          }}
                        >
                          <span>Open File</span>
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

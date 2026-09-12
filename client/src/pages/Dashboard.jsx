import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Plus, Shield, Scale, Clock, Lock, CheckCircle,
  ChevronRight, FileText, Bot, Printer, RefreshCw, Layout, List, Eye
} from '../components/Icons';
import { StatusBadge, CategoryBadge } from '../components/StatusBadge';
import { CaseDetail } from './CaseDetail';
import { api } from '../api/client';

export function Dashboard({
  onSelectCase,
  selectedCaseId: externalCaseId,
  onOpenIntake,
  onOpenSandbox,
  onOpenHashChain,
  onOpenNotice,
  activeRole = 'admin'
}) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('split'); // 'split' (left list + workbench) or 'table'
  const [selectedId, setSelectedId] = useState(externalCaseId || null);

  useEffect(() => {
    loadCases();
  }, [categoryFilter, statusFilter, search]);

  useEffect(() => {
    if (externalCaseId) {
      setSelectedId(externalCaseId);
    }
  }, [externalCaseId]);

  async function loadCases() {
    setLoading(true);
    try {
      const res = await api.getCases({
        category: categoryFilter,
        status: statusFilter,
        search
      });
      const caseList = res.cases || [];
      setCases(caseList);

      // Auto-select first case in split view if none selected
      if (!selectedId && caseList.length > 0) {
        setSelectedId(caseList[0].caseId);
      } else if (selectedId && !caseList.find(c => c.caseId === selectedId) && caseList.length > 0) {
        setSelectedId(caseList[0].caseId);
      }
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

  const currentCase = cases.find(c => c.caseId === selectedId) || cases[0];

  return (
    <div className="animate-fade-in">
      {/* Top Banner & Mode Toggle */}
      <div style={{
        background: 'linear-gradient(135deg, #070e1e 0%, #0d1e38 50%, #1e3a8a 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '1.25rem 1.75rem',
        marginBottom: '1.25rem',
        boxShadow: '0 8px 24px rgba(7, 14, 30, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.12)', padding: '0.15rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.35rem', color: '#60a5fa' }}>
            <Shield size={13} />
            <span>EduGuard • Autonomous Disciplinary Due Process Agent</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', color: '#ffffff', fontWeight: 800, margin: 0 }}>
            Institutional Disciplinary Case Workspace
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.2rem', lineHeight: 1.4 }}>
            Guaranteed guilt neutrality, mandatory statutory checklists, and SHA-256 tamper-evident record keeping.
          </p>
        </div>

        {/* View Mode Switcher and New Case Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Toggle between Split View and Table View */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '0.25rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <button
              onClick={() => setViewMode('split')}
              style={{
                background: viewMode === 'split' ? '#ffffff' : 'transparent',
                color: viewMode === 'split' ? '#0a2540' : '#cbd5e1',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              title="Split Workbench with Left Scrollable Case List"
            >
              <Layout size={14} />
              <span>Left List & Workbench</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                background: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? '#0a2540' : '#cbd5e1',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              title="Full Docket Table View"
            >
              <List size={14} />
              <span>Full Docket Table</span>
            </button>
          </div>

          <button
            className="btn btn-primary"
            onClick={onOpenIntake}
            id="open-intake-modal-btn"
            style={{
              background: '#ffffff',
              color: '#0a2540',
              fontWeight: 700,
              fontSize: '0.85rem',
              padding: '0.5rem 1rem'
            }}
          >
            <Plus size={16} />
            <span>File New Case</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>
            <span>TOTAL INCIDENTS</span>
            <FileText size={15} style={{ color: '#2563eb' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a2540', margin: '0.2rem 0' }}>
            {totalCount}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>5 Policy Categories</div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>
            <span>NOTICES & WINDOWS</span>
            <Clock size={15} style={{ color: '#d97706' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706', margin: '0.2rem 0' }}>
            {noticeActive}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Statutory replies pending</div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>
            <span>HEARINGS & QUORUM</span>
            <Scale size={15} style={{ color: '#7c3aed' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7c3aed', margin: '0.2rem 0' }}>
            {committeeActive}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Committee in session</div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>
            <span>SANCTION COMPLIANCE</span>
            <Clock size={15} style={{ color: '#2563eb' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563eb', margin: '0.2rem 0' }}>
            {sanctionActive}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Service / restitution active</div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>
            <span>RETENTION PURGE TIMER</span>
            <Lock size={15} style={{ color: '#16a34a' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', margin: '0.2rem 0' }}>
            {closedCount}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>3-Year auto-expungement</div>
        </div>
      </div>

      {/* VIEW MODE: SPLIT WORKBENCH WITH SCROLLABLE LEFT LIST */}
      {viewMode === 'split' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          gap: '1.25rem',
          alignItems: 'start'
        }}>
          {/* LEFT SIDEBAR: SCROLLABLE CASE LIST */}
          <div className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'calc(100vh - 170px)',
            position: 'sticky',
            top: '1rem',
            overflow: 'hidden'
          }}>
            {/* Left Sidebar Header with Search & Filter */}
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid #e2e8f0',
              background: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0a2540' }}>
                  Disciplinary Cases
                </span>
                <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
                  {cases.length} Records
                </span>
              </div>

              {/* Search Box */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.4rem 0.65rem',
                marginBottom: '0.65rem'
              }}>
                <Search size={14} style={{ color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search case, roll, name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.8rem'
                  }}
                />
              </div>

              {/* Quick Filters */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                <select
                  className="form-select"
                  style={{ padding: '0.35rem 0.5rem', fontSize: '0.72rem' }}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="ALL">All Categories</option>
                  <option value="ACADEMIC_MALPRACTICE">Academic</option>
                  <option value="CAMPUS_MISCONDUCT">Hostel</option>
                  <option value="ANTI_RAGGING_HARASSMENT">Anti-Ragging</option>
                  <option value="EXAMINATION_INFRACTION">Exam</option>
                  <option value="SUBSTANCE_ABUSE_VIOLATION">Substance</option>
                </select>

                <select
                  className="form-select"
                  style={{ padding: '0.35rem 0.5rem', fontSize: '0.72rem' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="INCIDENT_REGISTERED">Intake</option>
                  <option value="NOTICE_ISSUED">Notice</option>
                  <option value="RESPONSE_RECEIVED">Replied</option>
                  <option value="HEARING_CONVENED">Hearing</option>
                  <option value="SANCTION_IN_PROGRESS">Sanction</option>
                  <option value="CLOSED_RETENTION_ACTIVE">Closed</option>
                </select>
              </div>
            </div>

            {/* SCROLLABLE LIST OF CASES */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.8rem' }}>
                  Loading cases...
                </div>
              ) : cases.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.8rem' }}>
                  No matching cases found.
                </div>
              ) : (
                cases.map((c) => {
                  const isSelected = c.caseId === selectedId;
                  return (
                    <div
                      key={c.caseId}
                      onClick={() => {
                        setSelectedId(c.caseId);
                        if (onSelectCase) onSelectCase(c.caseId);
                      }}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.12)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = '#ffffff';
                      }}
                    >
                      {/* Case Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          color: isSelected ? '#1d4ed8' : '#0a2540',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          {c.caseNumber}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                          {new Date(c.incidentDate).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Student Info */}
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem', marginBottom: '0.15rem' }}>
                        {c.studentName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.5rem' }}>
                        {c.studentRoll} • {c.studentDept}
                      </div>

                      {/* Category & Status */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                        <CategoryBadge category={c.category} />
                        <StatusBadge status={c.status} />
                      </div>

                      {/* 9-Stage Progress Bar */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 600 }}>{c.stageName}</span>
                          <span style={{ fontWeight: 700 }}>Stage {c.stage}/9</span>
                        </div>
                        <div style={{
                          height: '5px',
                          background: '#e2e8f0',
                          borderRadius: '9999px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${(c.stage / 9) * 100}%`,
                            height: '100%',
                            background: c.stage >= 8 ? '#16a34a' : '#2563eb'
                          }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Register Case Footer */}
            <div style={{ padding: '0.75rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={onOpenIntake}
                style={{ width: '100%', fontSize: '0.8rem' }}
              >
                <Plus size={14} />
                <span>+ Register Disciplinary Incident</span>
              </button>
            </div>
          </div>

          {/* RIGHT WORKBENCH: FULL INTERACTIVE CASE DETAIL */}
          <div style={{ minWidth: 0 }}>
            {selectedId ? (
              <CaseDetail
                caseId={selectedId}
                onBack={() => setViewMode('table')}
                onOpenHashChain={onOpenHashChain}
                onOpenNotice={onOpenNotice}
                activeRole={activeRole}
              />
            ) : (
              <div className="card" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                <Shield size={40} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                <h3>No Case Selected</h3>
                <p style={{ fontSize: '0.85rem' }}>Select a case from the left list to inspect its due process file.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VIEW MODE: FULL DOCKET TABLE */
        <div>
          {/* Filter and Search Bar */}
          <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
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

          {/* Table */}
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
                        onClick={() => {
                          setSelectedId(c.caseId);
                          setViewMode('split');
                        }}
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
                                setSelectedId(c.caseId);
                                setViewMode('split');
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
      )}
    </div>
  );
}

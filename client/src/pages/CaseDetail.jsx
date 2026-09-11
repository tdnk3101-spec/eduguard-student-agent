import React, { useState, useEffect } from 'react';
import {
  Shield, Scale, Clock, Lock, CheckCircle, AlertTriangle, FileText,
  User, Send, Plus, RefreshCw, ChevronRight, Eye, Archive, Check, Layers
} from '../components/Icons';
import { StatusBadge, CategoryBadge } from '../components/StatusBadge';
import { EvidenceModal } from '../components/EvidenceModal';
import { AppealModal } from '../components/AppealModal';
import { api } from '../api/client';

export function CaseDetail({ caseId, onBack, onOpenHashChain, onOpenNotice, activeRole }) {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('checklist');
  const [gateCheck, setGateCheck] = useState(null);
  const [precedents, setPrecedents] = useState([]);

  // Modals inside CaseDetail
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [showAppealModal, setShowAppealModal] = useState(false);

  // Notice form
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [noticeType, setNoticeType] = useState('NOTICE_OF_ALLEGATION');
  const [noticeSubject, setNoticeSubject] = useState('');
  const [issuingNotice, setIssuingNotice] = useState(false);

  // Evidence upload form
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [newEvidenceTitle, setNewEvidenceTitle] = useState('');
  const [newEvidenceType, setNewEvidenceType] = useState('Physical Specimen Photo');
  const [newEvidenceDesc, setNewEvidenceDesc] = useState('');
  const [addingEvidence, setAddingEvidence] = useState(false);

  // Witness statement form
  const [showWitnessForm, setShowWitnessForm] = useState(false);
  const [witnessName, setWitnessName] = useState('');
  const [witnessRole, setWitnessRole] = useState('Course Invigilator');
  const [witnessStatement, setWitnessStatement] = useState('');
  const [addingWitness, setAddingWitness] = useState(false);

  // Decision form
  const [findingSummary, setFindingSummary] = useState('');
  const [selectedSanction, setSelectedSanction] = useState('');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [recordingDecision, setRecordingDecision] = useState(false);

  // Quorum form
  const [verifyingQuorum, setVerifyingQuorum] = useState(false);

  // Sanction milestone
  const [updatingSanction, setUpdatingSanction] = useState(false);

  useEffect(() => {
    loadCaseDetails();
  }, [caseId]);

  async function loadCaseDetails() {
    setLoading(true);
    try {
      const res = await api.getCaseById(caseId);
      setCaseData(res);
      if (res.policy && res.policy.allowableSanctions && res.policy.allowableSanctions.length > 0) {
        setSelectedSanction(res.policy.allowableSanctions[0]);
      }

      // Gate check
      const gateRes = await api.getGateCheck(caseId);
      setGateCheck(gateRes);

      // Precedents
      if (res.case && res.case.category) {
        const precRes = await api.getPrecedents(res.case.category);
        setPrecedents(precRes.precedents || []);
      }
    } catch (err) {
      console.error('Failed to load case details:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleIssueNotice(e) {
    e.preventDefault();
    setIssuingNotice(true);
    try {
      await api.createNotice(caseId, {
        noticeType,
        subject: noticeSubject,
        issuedBy: 'Office of the Disciplinary Administrator'
      });
      setShowNoticeForm(false);
      setNoticeSubject('');
      await loadCaseDetails();
      alert('Formal notice dispatched with recorded delivery.');
    } catch (err) {
      alert('Error issuing notice: ' + err.message);
    } finally {
      setIssuingNotice(false);
    }
  }

  async function handleAddEvidence(e) {
    e.preventDefault();
    if (!newEvidenceTitle.trim()) return;
    setAddingEvidence(true);
    try {
      await api.addEvidence(caseId, {
        title: newEvidenceTitle,
        type: newEvidenceType,
        description: newEvidenceDesc,
        uploadedBy: 'Proctorial Enquiry Officer'
      });
      setShowEvidenceForm(false);
      setNewEvidenceTitle('');
      setNewEvidenceDesc('');
      await loadCaseDetails();
      alert('Supplementary evidence officially admitted into the case docket.');
    } catch (err) {
      alert('Error adding evidence: ' + err.message);
    } finally {
      setAddingEvidence(false);
    }
  }

  async function handleAddWitness(e) {
    e.preventDefault();
    if (!witnessName.trim() || !witnessStatement.trim()) return;
    setAddingWitness(true);
    try {
      await api.addWitness(caseId, {
        witnessName,
        witnessRole,
        statementText: witnessStatement,
        recordedBy: 'Disciplinary Committee Registrar'
      });
      setShowWitnessForm(false);
      setWitnessName('');
      setWitnessStatement('');
      await loadCaseDetails();
      alert(`Witness statement of ${witnessName} officially recorded.`);
    } catch (err) {
      alert('Error adding witness: ' + err.message);
    } finally {
      setAddingWitness(false);
    }
  }

  async function handleVerifyQuorum() {
    setVerifyingQuorum(true);
    try {
      await api.verifyQuorum(caseId, {
        committeeMembers: [
          'Prof. R. Krishna (Chairman, Disciplinary Committee)',
          'Dr. S. K. Rao (Dean Representative)',
          'Dr. P. Sharma (Department Senior Professor)'
        ],
        chairPerson: 'Prof. R. Krishna'
      });
      await loadCaseDetails();
      alert('Committee Quorum verified (3 Members). Procedural hearing step completed.');
    } catch (err) {
      alert('Error verifying quorum: ' + err.message);
    } finally {
      setVerifyingQuorum(false);
    }
  }

  async function handleRecordDecision(e) {
    e.preventDefault();
    if (!findingSummary.trim()) {
      alert('Please provide a reasoned finding of facts.');
      return;
    }

    setRecordingDecision(true);
    try {
      await api.recordDecision(caseId, {
        committeeMembers: [
          'Prof. R. Krishna (Chair)',
          'Dr. S. K. Rao (Dean Representative)',
          'Dr. P. Sharma (Professor)'
        ],
        findingSummary,
        sanctionImposed: selectedSanction,
        sanctionDetails: decisionNotes || 'Sanction becomes operative upon delivery of this order.',
        recordedBy: 'Prof. R. Krishna (Chairperson)'
      });
      await loadCaseDetails();
      alert('Official committee decision recorded and sealed in tamper-evident ledger.');
      setActiveTab('sanctions');
    } catch (err) {
      alert('Gate Check Violation: ' + err.message);
    } finally {
      setRecordingDecision(false);
    }
  }

  async function handleCompleteMilestone(milestoneIndex) {
    if (!caseData.sanction) return;
    setUpdatingSanction(true);
    try {
      await api.updateSanction(caseId, caseData.sanction.sanctionId, {
        milestoneIndex,
        hoursAdded: 5,
        verifiedBy: 'Department Supervisor'
      });
      await loadCaseDetails();
    } catch (err) {
      alert('Error updating sanction: ' + err.message);
    } finally {
      setUpdatingSanction(false);
    }
  }

  async function handleCloseCase() {
    if (!confirm('Are you sure you want to officially close this case and start the retention expungement countdown?')) {
      return;
    }
    try {
      await api.closeCase(caseId, {
        closedBy: 'Disciplinary Administrator',
        notes: 'Sanctions completed. Procedural record verified.'
      });
      await loadCaseDetails();
      alert('Case closed. Retention expungement countdown activated.');
    } catch (err) {
      alert('Error closing case: ' + err.message);
    }
  }

  if (loading) {
    return (
      <div className="card" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
        Loading comprehensive case file {caseId}...
      </div>
    );
  }

  if (!caseData || !caseData.case) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: '#dc2626', marginBottom: '1rem' }}>Case not found.</p>
        <button className="btn btn-secondary" onClick={onBack}>Back to Register</button>
      </div>
    );
  }

  const {
    case: c, policy, checklist = [], notices = [], submissions = [],
    decision, sanction, appeals = [], witnessStatements = [], auditChainSummary
  } = caseData;

  const stages = [
    { num: 1, name: 'Intake' },
    { num: 2, name: 'Policy' },
    { num: 3, name: 'Notice' },
    { num: 4, name: 'Response' },
    { num: 5, name: 'Quorum' },
    { num: 6, name: 'Decision' },
    { num: 7, name: 'Appeal' },
    { num: 8, name: 'Sanction' },
    { num: 9, name: 'Retention' }
  ];

  return (
    <div className="animate-fade-in">
      {/* Top Breadcrumb & Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          ← Back to Case Register
        </button>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => window.print()}
            title="Print official legal dossier"
          >
            <FileText size={14} />
            <span>Print Dossier</span>
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onOpenHashChain(c.caseId)}
          >
            <Lock size={14} style={{ color: '#2563eb' }} />
            <span>SHA-256 Ledger ({auditChainSummary?.blockCount || 0} Blocks)</span>
          </button>
          {c.status !== 'CLOSED_RETENTION_ACTIVE' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleCloseCase}
              style={{ background: '#0a2540' }}
            >
              <Archive size={14} />
              <span>Close Case & Start Retention</span>
            </button>
          )}
        </div>
      </div>

      {/* Case Header Card */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#0a2540', fontFamily: 'var(--font-mono)' }}>
                {c.caseNumber}
              </h2>
              <StatusBadge status={c.status} />
              <CategoryBadge category={c.category} />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
              <strong>Allegation:</strong> {c.allegationSummary}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.78rem', color: '#64748b' }}>
              <span><strong>Student:</strong> {c.studentName} ({c.studentRoll})</span>
              <span><strong>Department:</strong> {c.studentDept}</span>
              <span><strong>Location:</strong> {c.incidentLocation}</span>
              <span><strong>Reporting Authority:</strong> {c.reportingAuthority}</span>
            </div>
          </div>

          {/* Retention Expungement Timer */}
          {c.retentionExpiryDate && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>RECORD EXPUNGEMENT TIMER</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0a2540', fontFamily: 'var(--font-mono)' }}>
                Purge: {new Date(c.retentionExpiryDate).toLocaleDateString()}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#16a34a' }}>Shielded from faculty & placement</div>
            </div>
          )}
        </div>

        {/* 9-Stage Progress Stepper */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute',
              top: '14px',
              left: '20px',
              right: '20px',
              height: '3px',
              background: '#e2e8f0',
              zIndex: 1
            }}>
              <div style={{
                height: '100%',
                background: '#2563eb',
                width: `${((c.stage - 1) / 8) * 100}%`,
                transition: 'width 0.3s ease'
              }}></div>
            </div>

            {stages.map((st) => {
              const isPast = st.num < c.stage;
              const isCurrent = st.num === c.stage;
              return (
                <div key={st.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: isPast ? '#16a34a' : isCurrent ? '#2563eb' : '#ffffff',
                    border: `2px solid ${isPast ? '#16a34a' : isCurrent ? '#2563eb' : '#cbd5e1'}`,
                    color: isPast || isCurrent ? '#ffffff' : '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isCurrent ? '0 0 0 4px rgba(37, 99, 235, 0.2)' : 'none'
                  }}>
                    {isPast ? <Check size={14} /> : st.num}
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#0a2540' : '#64748b', marginTop: '0.35rem' }}>
                    {st.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid #cbd5e1', marginBottom: '1.5rem', gap: '0.4rem', flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${activeTab === 'checklist' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          onClick={() => setActiveTab('checklist')}
        >
          <CheckCircle size={15} /> Procedural Checklist ({checklist.filter(s => s.status === 'COMPLETED').length}/9)
        </button>

        <button
          className={`btn btn-sm ${activeTab === 'evidence' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          onClick={() => setActiveTab('evidence')}
        >
          <FileText size={15} /> Evidence Index ({c.evidenceItems?.length || 0})
        </button>

        <button
          className={`btn btn-sm ${activeTab === 'witnesses' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          onClick={() => setActiveTab('witnesses')}
        >
          <User size={15} /> Witness Statements ({witnessStatements.length})
        </button>

        <button
          className={`btn btn-sm ${activeTab === 'notices' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          onClick={() => setActiveTab('notices')}
        >
          <Send size={15} /> Notices & Summons ({notices.length})
        </button>

        <button
          className={`btn btn-sm ${activeTab === 'submissions' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          onClick={() => setActiveTab('submissions')}
        >
          <User size={15} /> Right to be Heard ({submissions.length})
        </button>

        <button
          className={`btn btn-sm ${activeTab === 'committee' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          onClick={() => setActiveTab('committee')}
        >
          <Scale size={15} /> Committee & Precedents
        </button>

        <button
          className={`btn btn-sm ${activeTab === 'sanctions' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          onClick={() => setActiveTab('sanctions')}
        >
          <Clock size={15} /> Sanction Compliance ({sanction ? sanction.status : 'None'})
        </button>

        <button
          className={`btn btn-sm ${activeTab === 'appeals' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          onClick={() => setActiveTab('appeals')}
        >
          <Shield size={15} /> Appeals ({appeals.length})
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. PROCEDURAL CHECKLIST TAB */}
      {activeTab === 'checklist' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#0a2540', marginBottom: '0.4rem' }}>
              Statutory Procedural Checklist
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Enforces institutional due process. Steps 3 (Notice), 4 (Right to be Heard), and 5 (Quorum) are mandatory legal gates before any decision order can be entered.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {checklist.map((step) => {
                const isCompleted = step.status === 'COMPLETED';
                return (
                  <div
                    key={step.id}
                    style={{
                      background: isCompleted ? '#f0fdf4' : '#ffffff',
                      border: `1px solid ${isCompleted ? '#bbf7d0' : '#e2e8f0'}`,
                      borderRadius: '10px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div style={{
                        marginTop: '2px',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: isCompleted ? '#16a34a' : '#f1f5f9',
                        color: isCompleted ? '#ffffff' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {isCompleted ? <Check size={14} /> : step.stepNumber}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{ fontSize: '0.875rem', color: '#0a2540' }}>
                            {step.name}
                          </strong>
                          {step.mandatory && (
                            <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>Mandatory Gate</span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0.2rem 0' }}>
                          {step.description}
                        </p>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic' }}>
                          Gate requirement: {step.gateRequirement}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <StatusBadge status={step.status} />
                      {step.completedAt && (
                        <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.25rem' }}>
                          {new Date(step.completedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Policy Information Side Card */}
          <div>
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Shield size={18} style={{ color: '#2563eb' }} />
                <h4 style={{ fontSize: '0.95rem', color: '#0a2540' }}>Governing Policy</h4>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#1e293b', marginBottom: '0.75rem' }}>
                <strong>{policy?.name}</strong> ({policy?.code})
              </div>
              <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '1rem' }}>
                {policy?.description}
              </p>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
                <div><strong>Notice Window:</strong> {policy?.noticeDays} days</div>
                <div><strong>Response Window:</strong> {policy?.responseDays} days</div>
                <div><strong>Hearing Mandatory:</strong> {policy?.hearingMandatory ? 'Yes' : 'Discretionary'}</div>
                <div><strong>Committee Quorum:</strong> Min {policy?.committeeQuorumMin} members</div>
                <div><strong>Decision Authority:</strong> {policy?.decisionAuthority}</div>
                <div><strong>Appeal Window:</strong> {policy?.appealDays} days</div>
                <div><strong>Retention Period:</strong> {policy?.retentionYears} years</div>
              </div>
            </div>

            {/* Procedural Gate Check Status */}
            {gateCheck && (
              <div className="card" style={{ padding: '1.25rem', background: gateCheck.allowed ? '#f0fdf4' : '#fffbeb', border: `1px solid ${gateCheck.allowed ? '#bbf7d0' : '#fde68a'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {gateCheck.allowed ? (
                    <CheckCircle size={18} style={{ color: '#16a34a' }} />
                  ) : (
                    <AlertTriangle size={18} style={{ color: '#d97706' }} />
                  )}
                  <h4 style={{ fontSize: '0.9rem', color: gateCheck.allowed ? '#065f46' : '#92400e' }}>
                    {gateCheck.allowed ? 'Decision Gate Unlocked' : 'Decision Gate Locked'}
                  </h4>
                </div>
                <p style={{ fontSize: '0.75rem', color: gateCheck.allowed ? '#047857' : '#b45309' }}>
                  {gateCheck.message}
                </p>
                {gateCheck.missingSteps && gateCheck.missingSteps.length > 0 && (
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', fontSize: '0.72rem', color: '#b45309' }}>
                    {gateCheck.missingSteps.map((m, i) => (
                      <li key={i}>{m.name}: {m.reason}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. EVIDENCE INDEX TAB */}
      {activeTab === 'evidence' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#0a2540' }}>Evidentiary Case Record & Chain of Custody</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                All admitted physical documents, forensic log dumps, and photographic evidence.
              </p>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowEvidenceForm(!showEvidenceForm)}
            >
              <Plus size={14} /> Admit Supplementary Evidence
            </button>
          </div>

          {showEvidenceForm && (
            <form onSubmit={handleAddEvidence} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#0a2540', marginBottom: '0.75rem' }}>Admit Evidence to Chain of Custody</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Evidence Document Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Turnstile Biometric Access Log Sheet"
                    value={newEvidenceTitle}
                    onChange={(e) => setNewEvidenceTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Classification Type</label>
                  <select
                    className="form-select"
                    value={newEvidenceType}
                    onChange={(e) => setNewEvidenceType(e.target.value)}
                  >
                    <option value="System Forensic Log">System Forensic Log</option>
                    <option value="Signed Incident Statement">Signed Incident Statement</option>
                    <option value="Physical Specimen Photo">Physical Specimen Photo</option>
                    <option value="Audio/Video CCTV Specimen">Audio/Video CCTV Specimen</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Chain of Custody Notes</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Recovery circumstances, seal number, witness present..."
                  value={newEvidenceDesc}
                  onChange={(e) => setNewEvidenceDesc(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowEvidenceForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={addingEvidence}>
                  <CheckCircle size={14} /> {addingEvidence ? 'Sealing...' : 'Admit & Seal in Hash Ledger'}
                </button>
              </div>
            </form>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {c.evidenceItems?.map((ev) => (
              <div
                key={ev.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  background: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="badge badge-blue" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
                      {ev.id}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {new Date(ev.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.9rem', color: '#0a2540', display: 'block', marginBottom: '0.35rem' }}>
                    {ev.title}
                  </strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Type: {ev.type}
                  </div>
                </div>

                <div style={{ marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#16a34a' }}>✓ Authenticated</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
                    onClick={() => setSelectedEvidence(ev)}
                  >
                    <Eye size={13} /> View Specimen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. WITNESS STATEMENTS TAB */}
      {activeTab === 'witnesses' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#0a2540' }}>Witness Depositions & Statements</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Factual statements recorded from faculty invigilators, laboratory assistants, and witnesses.
              </p>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowWitnessForm(!showWitnessForm)}
            >
              <Plus size={14} /> Record Witness Statement
            </button>
          </div>

          {showWitnessForm && (
            <form onSubmit={handleAddWitness} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#0a2540', marginBottom: '0.75rem' }}>Record Formal Witness Deposition</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Witness Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dr. S. K. Narayanan"
                    value={witnessName}
                    onChange={(e) => setWitnessName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Witness Role / Designation</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Lab Invigilator / Room Proctor"
                    value={witnessRole}
                    onChange={(e) => setWitnessRole(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Factual Deposition Statement</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Record the witness's direct factual observations..."
                  value={witnessStatement}
                  onChange={(e) => setWitnessStatement(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowWitnessForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={addingWitness}>
                  <CheckCircle size={14} /> {addingWitness ? 'Recording...' : 'Record Statement into Case Docket'}
                </button>
              </div>
            </form>
          )}

          {witnessStatements.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b', background: '#f8fafc', borderRadius: '8px' }}>
              No formalized witness depositions recorded yet for this docket.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {witnessStatements.map((wit) => (
                <div key={wit.statementId} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', background: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: '#0a2540' }}>{wit.witnessName}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.5rem' }}>({wit.witnessRole})</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Recorded on {new Date(wit.recordedAt).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', fontStyle: 'italic', lineHeight: 1.6 }}>
                    "{wit.statementText}"
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. NOTICES TAB */}
      {activeTab === 'notices' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#0a2540' }}>Formal Notices & Communications</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Every communication uses approved statutory templates with digital delivery tracking and receipt verification.
              </p>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowNoticeForm(!showNoticeForm)}
            >
              <Plus size={14} /> Issue Formal Notice
            </button>
          </div>

          {/* Issue Notice Inline Form */}
          {showNoticeForm && (
            <form onSubmit={handleIssueNotice} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#0a2540', marginBottom: '0.75rem' }}>Draft New Statutory Notice</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Notice Template</label>
                  <select
                    className="form-select"
                    value={noticeType}
                    onChange={(e) => setNoticeType(e.target.value)}
                  >
                    <option value="NOTICE_OF_ALLEGATION">Notice of Allegation (Due Process Right to be Heard)</option>
                    <option value="HEARING_SUMMONS">Formal Hearing Summons to Appear</option>
                    <option value="DECISION_ORDER">Official Decision & Sanction Order</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Subject Heading</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Formal Notice of Hearing regarding CS302 Practical"
                    value={noticeSubject}
                    onChange={(e) => setNoticeSubject(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowNoticeForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={issuingNotice}>
                  <Send size={14} /> {issuingNotice ? 'Dispatching...' : 'Dispatch Notice with Delivery Tracking'}
                </button>
              </div>
            </form>
          )}

          {/* Notices List */}
          {notices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
              No official notices issued yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {notices.map((n) => (
                <div
                  key={n.noticeId}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      background: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#0a2540' }}>{n.subject}</strong>
                        <span className="badge badge-slate" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                          {n.referenceNumber}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Recipient: {n.recipientName} ({n.recipientEmail}) • Issued: {new Date(n.issuedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${n.deliveryStatus === 'ACKNOWLEDGED' ? 'badge-green' : 'badge-blue'}`}>
                        {n.deliveryStatus === 'ACKNOWLEDGED' ? 'Receipt Acknowledged' : 'Delivered'}
                      </span>
                      {n.acknowledgedAt && (
                        <div style={{ fontSize: '0.68rem', color: '#16a34a', marginTop: '0.2rem' }}>
                          Ack: {new Date(n.acknowledgedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onOpenNotice(n)}
                    >
                      <Eye size={14} /> View Letter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. SUBMISSIONS TAB */}
      {activeTab === 'submissions' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#0a2540' }}>Right to be Heard — Student Statements</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Official defense statements, explanations, and supporting evidence submitted by the student into the case file.
              </p>
            </div>
          </div>

          {submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', background: '#f8fafc', borderRadius: '10px' }}>
              <Clock size={32} style={{ color: '#d97706', marginBottom: '0.5rem' }} />
              <p style={{ fontWeight: 600, color: '#0a2540' }}>No statement submitted yet</p>
              <p style={{ fontSize: '0.8rem' }}>The student response window is active until {new Date(c.responseDeadline).toLocaleDateString()}.</p>
              <p style={{ fontSize: '0.75rem', color: '#2563eb', marginTop: '0.5rem' }}>
                (Switch to <strong>Student Role</strong> from the top navbar to submit a statement as Rohan Sharma)
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {submissions.map((sub) => (
                <div key={sub.submissionId} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem', background: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: '#0a2540' }}>Statement of {sub.submittedBy}</strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Recorded on {new Date(sub.submittedAt).toLocaleString()} • Hash block sealed
                      </div>
                    </div>
                    <span className="badge badge-green">Legally Admitted to Record</span>
                  </div>

                  <div style={{ whiteSpace: 'pre-line', fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    "{sub.statementText}"
                  </div>

                  {sub.attachments && sub.attachments.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>
                        SUBMITTED EVIDENCE ATTACHMENTS:
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {sub.attachments.map((att, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', color: '#1d4ed8' }}>
                            <FileText size={14} />
                            <span>{att.name} ({att.size || 'Attachment'})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. COMMITTEE WORKSPACE TAB */}
      {activeTab === 'committee' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }}>
          {/* Left Column: Decision & Findings Form */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#0a2540' }}>Committee Deliberation & Findings</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Authorized committee members record findings of fact and reasoned orders under {policy?.code}.
                </p>
              </div>
            </div>

            {/* Quorum Verification Block */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0a2540' }}>
                  Statutory Quorum Verification
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Policy requirement: Minimum {policy?.committeeQuorumMin} appointed members.
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleVerifyQuorum}
                disabled={verifyingQuorum}
              >
                <CheckCircle size={14} />
                <span>{verifyingQuorum ? 'Verifying...' : 'Verify Quorum (3 Members)'}</span>
              </button>
            </div>

            {/* Existing Decision View or Form */}
            {decision ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <CheckCircle size={18} style={{ color: '#16a34a' }} />
                  <strong style={{ fontSize: '0.95rem', color: '#065f46' }}>Official Committee Decision Recorded</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#1e293b', marginBottom: '0.5rem' }}>
                  <strong>Imposed Sanction:</strong> {decision.sanctionImposed}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#334155', marginBottom: '0.75rem' }}>
                  <strong>Findings of Fact:</strong> {decision.findingSummary}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Recorded by {decision.recordedBy} on {new Date(decision.recordedAt).toLocaleString()}<br />
                  Appeal deadline: {new Date(decision.appealDeadline).toLocaleDateString()}
                </div>
              </div>
            ) : (
              <form onSubmit={handleRecordDecision}>
                {/* Strict Guardrail Notice */}
                <div className="guardrail-box" style={{ marginBottom: '1.25rem' }}>
                  <Shield size={18} style={{ color: '#16a34a' }} />
                  <div style={{ fontSize: '0.78rem', color: '#065f46' }}>
                    <strong>Guardrail Enforced:</strong> The agent does not calculate guilt or auto-suggest a sanction. The decision and reasoning must be entered by authorized human committee members.
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Finding of Facts & Reasoned Justification</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Enter the committee's objective findings based on evidence, testimony, and student submissions..."
                    value={findingSummary}
                    onChange={(e) => setFindingSummary(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Sanction Selection (Strictly Restricted to Policy Prescribed Range)
                  </label>
                  <select
                    className="form-select"
                    value={selectedSanction}
                    onChange={(e) => setSelectedSanction(e.target.value)}
                  >
                    {policy?.allowableSanctions?.map((sanc, i) => (
                      <option key={i} value={sanc}>{sanc}</option>
                    ))}
                    <option value="Exonerated / Case Dismissed without Sanction">
                      Exonerated / Case Dismissed without Sanction
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Specific Execution Details</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 15 hours of community service under proctorial supervision..."
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Appellate Route: Dean of Academic Governance (14 Days)
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={recordingDecision}
                  >
                    <Scale size={16} />
                    <span>{recordingDecision ? 'Recording Order...' : 'Record Reasoned Decision'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Precedent Comparator */}
          <div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Scale size={18} style={{ color: '#2563eb' }} />
                <h4 style={{ fontSize: '0.95rem', color: '#0a2540' }}>Anonymised Precedent Explorer</h4>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
                Comparable historical cases under <strong>{policy?.name}</strong> to promote uniformity and consistency of outcomes.
              </p>

              {precedents.length === 0 ? (
                <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', padding: '1.5rem' }}>
                  No historical precedents filed for this category yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {precedents.map((prec) => (
                    <div
                      key={prec.precedentId}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '0.875rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <strong style={{ fontSize: '0.8rem', color: '#0a2540', fontFamily: 'var(--font-mono)' }}>
                          {prec.precedentId}
                        </strong>
                        <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>
                          AY {prec.academicYear}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#334155', marginBottom: '0.4rem' }}>
                        <strong>Facts:</strong> {prec.incidentSummary}
                      </p>
                      <div style={{ fontSize: '0.72rem', color: '#16a34a', background: '#ecfdf5', padding: '0.35rem 0.5rem', borderRadius: '4px' }}>
                        <strong>Imposed Outcome:</strong> {prec.finalSanction}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. SANCTION TRACKER TAB */}
      {activeTab === 'sanctions' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#0a2540' }}>Sanction Compliance & Case Closure</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Monitors assigned educational restitution, community service, or compliance milestones before case closure.
              </p>
            </div>
            {sanction && sanction.status === 'COMPLIANCE_VERIFIED' && (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleCloseCase}
                style={{ background: '#16a34a' }}
              >
                <CheckCircle size={14} /> Close Case File
              </button>
            )}
          </div>

          {!sanction ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', background: '#f8fafc', borderRadius: '10px' }}>
              <CheckCircle size={32} style={{ color: '#16a34a', marginBottom: '0.5rem' }} />
              <p style={{ fontWeight: 600, color: '#0a2540' }}>No Active Sanction Imposed</p>
              <p style={{ fontSize: '0.8rem' }}>
                Sanction tracking activates automatically once a decision requiring compliance is recorded.
              </p>
            </div>
          ) : (
            <div>
              {/* Progress Summary Header */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#0a2540', marginBottom: '0.2rem' }}>
                    {sanction.title}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Assigned Authority: {sanction.assignedAuthority} • Due: {new Date(sanction.dueDate).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={sanction.status} />
                  {sanction.totalHoursRequired > 0 && (
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563eb', marginTop: '0.25rem' }}>
                      {sanction.hoursCompleted} / {sanction.totalHoursRequired} Hours Completed
                    </div>
                  )}
                </div>
              </div>

              {/* Milestones List */}
              <h4 style={{ fontSize: '0.9rem', color: '#0a2540', marginBottom: '0.75rem' }}>
                Compliance Milestones & Authority Verifications
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {sanction.milestones?.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: m.completed ? '#f0fdf4' : '#ffffff',
                      border: `1px solid ${m.completed ? '#bbf7d0' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: m.completed ? '#16a34a' : '#f1f5f9',
                        color: m.completed ? '#ffffff' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem'
                      }}>
                        {m.completed ? <Check size={14} /> : idx + 1}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.85rem', color: '#0a2540' }}>{m.title}</strong>
                        {m.verifiedBy && (
                          <div style={{ fontSize: '0.7rem', color: '#16a34a' }}>
                            Verified by {m.verifiedBy}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      {m.completed ? (
                        <span className="badge badge-green">Verified</span>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleCompleteMilestone(idx)}
                          disabled={updatingSanction}
                        >
                          <Check size={14} /> Verify & Log Proof
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. APPEALS TAB */}
      {activeTab === 'appeals' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#0a2540' }}>Statutory Appeals & Appellate Review</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Procedural appeal reviews before the Standing Appellate Authority under Section 14(B).
              </p>
            </div>
            {decision && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowAppealModal(true)}
              >
                <Scale size={14} /> {appeals.length > 0 && activeRole === 'governance' ? 'Enter Appellate Order' : 'File Statutory Appeal'}
              </button>
            )}
          </div>

          {appeals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', background: '#f8fafc', borderRadius: '10px' }}>
              <Shield size={32} style={{ color: '#2563eb', marginBottom: '0.5rem' }} />
              <p style={{ fontWeight: 600, color: '#0a2540' }}>No Appeals Filed</p>
              <p style={{ fontSize: '0.8rem' }}>
                {decision ? 'The student may submit a formal appeal within the statutory window.' : 'Appeals are open following a formal committee decision order.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {appeals.map((appItem) => (
                <div key={appItem.appealId} style={{ border: '1px solid #bfdbfe', background: '#eff6ff', borderRadius: '10px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#1e3a8a', fontFamily: 'var(--font-mono)' }}>
                        {appItem.appealId}
                      </strong>
                      <span className="badge badge-purple">{appItem.status}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Filed: {new Date(appItem.filedAt).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.75rem', background: '#ffffff', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <strong>Grounds of Appeal:</strong> {appItem.groundsOfAppeal}
                  </div>

                  {appItem.appellateDetermination ? (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.8rem', color: '#065f46' }}>
                      <strong>Appellate Determination:</strong> {appItem.appellateDetermination}<br />
                      <strong>Order:</strong> {appItem.appellateOrder}<br />
                      <span style={{ fontSize: '0.7rem', color: '#047857' }}>Decided by {appItem.decidedBy} on {new Date(appItem.decidedAt).toLocaleString()}</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: '#d97706' }}>
                      Under Review by {appItem.appellateAuthority}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {selectedEvidence && (
        <EvidenceModal
          evidence={selectedEvidence}
          caseNumber={c.caseNumber}
          onClose={() => setSelectedEvidence(null)}
        />
      )}

      {showAppealModal && (
        <AppealModal
          caseItem={c}
          isAppellateAuthority={activeRole === 'governance'}
          existingAppeal={appeals.length > 0 ? appeals[0] : null}
          onClose={() => setShowAppealModal(false)}
          onSuccess={() => loadCaseDetails()}
        />
      )}
    </div>
  );
}

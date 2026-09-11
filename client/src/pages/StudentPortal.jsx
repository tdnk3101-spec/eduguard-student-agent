import React, { useState, useEffect } from 'react';
import { User, FileText, CheckCircle, Clock, Send, Lock, Eye, AlertTriangle } from '../components/Icons';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../api/client';

export function StudentPortal({ onOpenNotice, onSelectCase }) {
  const [studentCase, setStudentCase] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statementText, setStatementText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    loadStudentData();
  }, []);

  async function loadStudentData() {
    setLoading(true);
    try {
      // Find active case for Rohan Sharma (DISC-2026-0001)
      const res = await api.getCaseById('DISC-2026-0001');
      setStudentCase(res.case);
      setNotices(res.notices || []);
      if (res.submissions && res.submissions.length > 0) {
        setSubmittedSuccess(true);
      }
    } catch (err) {
      console.error('Failed to load student data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAcknowledge(noticeId) {
    try {
      await api.acknowledgeNotice(noticeId, '22BCE1048');
      await loadStudentData();
      alert('Official notice delivery acknowledged and recorded in the case file.');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  async function handleSubmitStatement(e) {
    e.preventDefault();
    if (!statementText.trim()) {
      alert('Please enter your written statement or explanation.');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitResponse('DISC-2026-0001', {
        submittedBy: 'Rohan Sharma (22BCE1048)',
        statementText,
        attachments: [
          { name: 'Student_Explanation_and_Witness_List.pdf', size: '210 KB' }
        ]
      });
      setSubmittedSuccess(true);
      setStatementText('');
      await loadStudentData();
      alert('Your statement has been officially submitted to the case file and locked in the tamper-evident ledger.');
    } catch (err) {
      alert('Error submitting statement: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        Loading Student Due-Process Portal...
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Student Identity Banner */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem'
            }}>
              RS
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', color: '#0a2540' }}>Rohan Sharma</h2>
                <span className="badge badge-blue">Student Portal</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Roll No: <strong>22BCE1048</strong> • B.Tech Computer Science & Engineering (3rd Year)
              </div>
            </div>
          </div>

          <div style={{
            background: '#ecfdf5',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '0.5rem 0.85rem',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#065f46' }}>
              DUE PROCESS PROTECTION: ACTIVE
            </div>
            <div style={{ fontSize: '0.7rem', color: '#047857' }}>
              Statutory Right to be Heard Guaranteed
            </div>
          </div>
        </div>
      </div>

      {/* Case Overview & Active Notice */}
      {studentCase && (
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>ACTIVE PROCEEDING</span>
              <h3 style={{ fontSize: '1.1rem', color: '#0a2540', fontFamily: 'var(--font-mono)' }}>
                {studentCase.caseNumber}
              </h3>
            </div>
            <StatusBadge status={studentCase.status} />
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#334155', border: '1px solid #e2e8f0' }}>
            <strong>Subject of Enquiry:</strong> {studentCase.allegationSummary}
          </div>

          {/* Notices Section */}
          <h4 style={{ fontSize: '0.95rem', color: '#0a2540', marginBottom: '0.75rem' }}>
            Official Institutional Communications
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
            {notices.map((n) => (
              <div
                key={n.noticeId}
                style={{
                  border: '1px solid #bfdbfe',
                  background: '#eff6ff',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.9rem' }}>{n.subject}</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem' }}>
                    Reference: {n.referenceNumber} • Issued: {new Date(n.issuedAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onOpenNotice(n)}
                  >
                    <Eye size={14} /> Read Full Letter
                  </button>

                  {!n.acknowledgedAt ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAcknowledge(n.noticeId)}
                    >
                      <CheckCircle size={14} /> Acknowledge Receipt
                    </button>
                  ) : (
                    <span className="badge badge-green">
                      Acknowledged {new Date(n.acknowledgedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right to be Heard Submission Form */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: '#0a2540', marginBottom: '0.4rem' }}>
              Exercise Your Right to be Heard (Response Submission)
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Under institutional statute, you have the right to submit your written explanation, factual context, witness requests, and any supporting files directly to the Disciplinary Committee.
            </p>

            {submittedSuccess ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1.5rem', textAlign: 'center' }}>
                <CheckCircle size={32} style={{ color: '#16a34a', marginBottom: '0.5rem' }} />
                <h4 style={{ color: '#065f46', fontSize: '1rem', marginBottom: '0.25rem' }}>
                  Your Defense Statement is Officially Recorded
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#047857' }}>
                  The Disciplinary Committee will review your submission prior to scheduling any formal hearing or deliberation.
                </p>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '1rem' }}
                  onClick={() => onSelectCase('DISC-2026-0001')}
                >
                  View Case File Checklist
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitStatement}>
                <div className="form-group">
                  <label className="form-label">Written Statement / Explanation</label>
                  <textarea
                    className="form-textarea"
                    rows={5}
                    placeholder="Provide your complete account of events, mitigating circumstances, or relevant details..."
                    value={statementText}
                    onChange={(e) => setStatementText(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Response Deadline: <strong>{new Date(studentCase.responseDeadline).toLocaleDateString()}</strong>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    <Send size={15} />
                    <span>{submitting ? 'Sealing into Ledger...' : 'Submit Official Response'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

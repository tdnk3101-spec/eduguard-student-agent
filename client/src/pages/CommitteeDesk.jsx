import React, { useState, useEffect } from 'react';
import { Scale, CheckCircle, Clock, Shield, AlertTriangle, ChevronRight, FileText } from '../components/Icons';
import { StatusBadge, CategoryBadge } from '../components/StatusBadge';
import { api } from '../api/client';

export function CommitteeDesk({ onSelectCase }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommitteeCases();
  }, []);

  async function loadCommitteeCases() {
    setLoading(true);
    try {
      const res = await api.getCases();
      // Filter cases at stages 4, 5, 6, 7
      const pendingReview = (res.cases || []).filter(c => 
        c.stage === 4 || c.stage === 5 || c.stage === 6 || c.stage === 7
      );
      setCases(pendingReview);
    } catch (err) {
      console.error('Error loading committee cases:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Committee Desk Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a8a 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '1.75rem 2rem',
        marginBottom: '1.75rem',
        boxShadow: '0 4px 20px rgba(30, 27, 75, 0.15)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.6rem' }}>
          <Scale size={13} style={{ color: '#a5b4fc' }} />
          <span>Standing Disciplinary Committee Workspace</span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.35rem' }}>
          Active Committee Deliberation Docket
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#c7d2fe', lineHeight: 1.5, maxWidth: '750px' }}>
          Review case files, verify statutory quorums, inspect comparative precedents, and record reasoned findings. 
          The agent strictly enforces procedural gates: cases cannot proceed to a decision until due process requirements are verified.
        </p>
      </div>

      {/* Guardrail Box */}
      <div className="guardrail-box" style={{ marginBottom: '1.5rem' }}>
        <Shield size={20} style={{ color: '#16a34a' }} />
        <div style={{ fontSize: '0.825rem', color: '#065f46' }}>
          <strong>Institutional Guardrail:</strong> EduGuard does not evaluate the credibility of witness statements or recommend sanctions. Its role is to present the evidentiary record and enforce procedural bounds.
        </div>
      </div>

      {/* Cases List */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ padding: '0 0 1rem 0', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', color: '#0a2540' }}>
            Cases Awaiting Deliberation & Quorum Verification ({cases.length})
          </h3>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Ready for formal hearing and reasoned order
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Loading committee docket...
          </div>
        ) : cases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            No pending cases currently awaiting committee action.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cases.map((c) => (
              <div
                key={c.caseId}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#0a2540', fontFamily: 'var(--font-mono)' }}>
                      {c.caseNumber}
                    </strong>
                    <StatusBadge status={c.status} />
                    <CategoryBadge category={c.category} />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                    <strong>Student:</strong> {c.studentName} ({c.studentRoll}) • {c.studentDept}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    <strong>Allegation:</strong> {c.allegationSummary}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                      Stage {c.stage}/9: {c.stageName}
                    </span>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onSelectCase(c.caseId)}
                  >
                    <Scale size={14} /> Open Committee Workspace
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, FileText, CheckCircle, Clock, Send, Lock } from './Icons';
import { api } from '../api/client';

export function NoticeModal({ notice, onClose, onAcknowledgeSuccess, isStudentView = false }) {
  const [acknowledging, setAcknowledging] = useState(false);

  if (!notice) return null;

  async function handleAcknowledge() {
    setAcknowledging(true);
    try {
      await api.acknowledgeNotice(notice.noticeId, '22BCE1048');
      if (onAcknowledgeSuccess) onAcknowledgeSuccess();
      onClose();
    } catch (err) {
      alert('Failed to acknowledge notice: ' + err.message);
    } finally {
      setAcknowledging(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '750px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 36,
              height: 36,
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
              <h3 style={{ fontSize: '1.1rem', color: '#0a2540' }}>
                Official Disciplinary Communication
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Reference: {notice.referenceNumber} • Case ID: {notice.caseId}
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ background: '#f8fafc' }}>
          {/* Institutional Letterhead Paper */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            fontFamily: 'Georgia, serif',
            color: '#1e293b',
            lineHeight: 1.65
          }}>
            {/* University Crest / Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px double #0a2540', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.15em', color: '#2563eb' }}>
                VIGNAN'S FOUNDATION FOR SCIENCE, TECHNOLOGY AND RESEARCH
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0a2540', margin: '0.25rem 0' }}>
                OFFICE OF THE DISCIPLINARY COMMITTEE & PROCTORIAL BOARD
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                Statutory Due-Process Procedural Notice
              </div>
            </div>

            {/* Reference & Metadata */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)' }}>
              <div>
                <strong>Ref No:</strong> {notice.referenceNumber}<br />
                <strong>To:</strong> {notice.recipientName}<br />
                <strong>Email:</strong> {notice.recipientEmail}
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>Date of Issue:</strong> {new Date(notice.issuedAt).toLocaleDateString()}<br />
                <strong>Issued By:</strong> {notice.issuedBy}
              </div>
            </div>

            {/* Subject */}
            <div style={{
              background: '#f1f5f9',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: '#0a2540',
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-sans)'
            }}>
              SUBJECT: {notice.subject}
            </div>

            {/* Notice Body */}
            <div style={{ whiteSpace: 'pre-line', fontSize: '0.925rem', marginBottom: '2rem' }}>
              {notice.contentBody}
            </div>

            {/* Appeal Rights clause */}
            {notice.appealInfo && (
              <div style={{
                borderTop: '1px solid #e2e8f0',
                paddingTop: '1rem',
                fontSize: '0.8rem',
                color: '#475569',
                fontStyle: 'italic',
                fontFamily: 'var(--font-sans)'
              }}>
                <strong>Procedural Note:</strong> {notice.appealInfo}
              </div>
            )}

            {/* Delivery & Acknowledgment Stamp */}
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: notice.acknowledgedAt ? '#f0fdf4' : '#eff6ff',
              border: `1px solid ${notice.acknowledgedAt ? '#bbf7d0' : '#bfdbfe'}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={16} style={{ color: notice.acknowledgedAt ? '#16a34a' : '#2563eb' }} />
                <span>
                  Delivery Status: <strong>{notice.deliveryStatus}</strong>
                  {notice.acknowledgedAt && ` • Acknowledged on ${new Date(notice.acknowledgedAt).toLocaleString()}`}
                </span>
              </div>
              <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
                Tamper-Evident SHA-256 Block Recorded
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {isStudentView && !notice.acknowledgedAt && (
            <button
              className="btn btn-primary"
              onClick={handleAcknowledge}
              disabled={acknowledging}
            >
              <CheckCircle size={16} />
              <span>{acknowledging ? 'Confirming Delivery...' : 'Confirm Delivery & Acknowledge Receipt'}</span>
            </button>
          )}
          <button className="btn btn-secondary" onClick={onClose}>
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
}

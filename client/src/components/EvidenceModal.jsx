import React from 'react';
import { X, FileText, Lock, Shield, CheckCircle, Clock } from './Icons';

export function EvidenceModal({ evidence, caseNumber, onClose }) {
  if (!evidence) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '700px' }}>
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
              <h3 style={{ fontSize: '1.05rem', color: '#0a2540' }}>
                Evidentiary Case Record Document
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Case: {caseNumber} • Evidence Tag: {evidence.id}
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Chain of Custody Box */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0a2540', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              <Lock size={15} style={{ color: '#2563eb' }} />
              <span>Chain of Custody & Admissibility Verification</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', color: '#475569' }}>
              <div><strong>Document Title:</strong> {evidence.title}</div>
              <div><strong>Evidence Type:</strong> {evidence.type}</div>
              <div><strong>Admitted At:</strong> {new Date(evidence.timestamp).toLocaleString()}</div>
              <div><strong>Admitted By:</strong> {evidence.admittedBy || 'Authorized Proctorial Officer'}</div>
            </div>
          </div>

          {/* Document Content Simulation */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '1.5rem',
            fontFamily: evidence.type.includes('Log') ? 'var(--font-mono)' : 'inherit',
            fontSize: '0.8rem',
            lineHeight: 1.6,
            color: '#1e293b',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
          }}>
            {evidence.type.includes('Log') ? (
              <div style={{ color: '#0284c7' }}>
                [2026-09-08 14:32:01 UTC] [INFO] Connection established from lab-workstation-304<br />
                [2026-09-08 14:35:12 UTC] [WARN] Secondary SSH session detected on port 2222<br />
                [2026-09-08 14:35:14 UTC] [ALERT] Process spawned: /usr/bin/python3 -m http.server (PORT: 8080)<br />
                [2026-09-08 14:35:18 UTC] [AUDIT] Forensic memory snapshot saved to /var/log/audit/exam_mal_01.raw<br />
                [2026-09-08 14:35:20 UTC] [VERIFIED] MD5 Checksum: 8f4b23c910e4a71d882b53112c<br />
                -- END OF LOG FORENSIC DUMP --
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 700, borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.75rem', color: '#0a2540' }}>
                  INSTITUTIONAL RECORD SPECIMEN: {evidence.title}
                </div>
                <p style={{ marginBottom: '0.75rem' }}>
                  This official document has been deposited into the disciplinary record for {caseNumber}. 
                  The physical or digital specimen is held in the secure vault of the Office of Student Welfare.
                </p>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', fontSize: '0.75rem', color: '#475569' }}>
                  <strong>Evidentiary Notes:</strong> Corroborated with invigilator sign-off sheet and digital proctoring logs. Admitted under Vignan Disciplinary Procedure Statute Section 14(B).
                </div>
              </div>
            )}
          </div>

          <div style={{
            marginTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: '#16a34a'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle size={14} />
              <span>SHA-256 Cryptographic Digest Linked to Block Ledger</span>
            </div>
            <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Admitted as Evidence</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close Document Preview
          </button>
        </div>
      </div>
    </div>
  );
}

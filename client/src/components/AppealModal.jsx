import React, { useState } from 'react';
import { X, Scale, Send, Shield, CheckCircle } from './Icons';
import { api } from '../api/client';

export function AppealModal({ caseItem, onClose, onSuccess, isAppellateAuthority = false, existingAppeal = null }) {
  const [grounds, setGrounds] = useState('');
  const [loading, setLoading] = useState(false);

  // Appellate decision fields
  const [determination, setDetermination] = useState('Sanction Reduced upon Remedial Undertaking');
  const [appellateOrder, setAppellateOrder] = useState('');

  async function handleSubmitAppeal(e) {
    e.preventDefault();
    if (!grounds.trim()) {
      alert('Please enter detailed grounds of appeal.');
      return;
    }

    setLoading(true);
    try {
      await api.fileAppeal(caseItem.caseId, {
        groundsOfAppeal: grounds,
        appellantName: `${caseItem.studentName} (${caseItem.studentRoll})`,
        studentRoll: caseItem.studentRoll
      });
      alert('Statutory appeal filed and transferred to Appellate Board docket.');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      alert('Error filing appeal: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDecideAppeal(e) {
    e.preventDefault();
    if (!existingAppeal) return;

    setLoading(true);
    try {
      await api.decideAppeal(caseItem.caseId, existingAppeal.appealId, {
        appellateDetermination: determination,
        appellateOrder: appellateOrder || 'The Appellate Authority has reviewed the record, noted mitigating circumstances, and ordered a modified sanction.',
        decidedBy: 'Appellate Tribunal (Dean of Academic Governance)'
      });
      alert('Appellate determination entered and sealed into case file.');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      alert('Error recording appellate decision: ' + err.message);
    } finally {
      setLoading(false);
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
              <Scale size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#0a2540' }}>
                {isAppellateAuthority ? 'Appellate Tribunal Review' : 'Statutory Disciplinary Appeal Filing'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Case: {caseItem.caseNumber} • Student: {caseItem.studentName} ({caseItem.studentRoll})
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        {isAppellateAuthority && existingAppeal ? (
          <form onSubmit={handleDecideAppeal}>
            <div className="modal-body">
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0a2540', marginBottom: '0.3rem' }}>
                  Appellant's Grounds of Appeal:
                </div>
                <p style={{ fontSize: '0.8rem', color: '#334155', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{existingAppeal.groundsOfAppeal}"
                </p>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.4rem' }}>
                  Filed on {new Date(existingAppeal.filedAt).toLocaleString()}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Appellate Determination</label>
                <select
                  className="form-select"
                  value={determination}
                  onChange={(e) => setDetermination(e.target.value)}
                >
                  <option value="Sanction Reduced upon Remedial Undertaking">Sanction Reduced upon Remedial Undertaking</option>
                  <option value="Sanction Confirmed & Affirmed">Sanction Confirmed & Affirmed</option>
                  <option value="Case Remanded for Re-hearing">Case Remanded for Re-hearing</option>
                  <option value="Sanction Converted to Conditional Probation">Sanction Converted to Conditional Probation</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Appellate Order & Reasons</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="State the appellate tribunal's reasoning..."
                  value={appellateOrder}
                  onChange={(e) => setAppellateOrder(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Scale size={15} />
                <span>{loading ? 'Recording Order...' : 'Enter Appellate Order'}</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitAppeal}>
            <div className="modal-body">
              <div className="guardrail-box" style={{ marginBottom: '1.25rem' }}>
                <Shield size={18} style={{ color: '#16a34a' }} />
                <div style={{ fontSize: '0.78rem', color: '#065f46' }}>
                  <strong>Statutory Right of Appeal:</strong> Under institutional statute, any student has the constitutional right to appeal committee sanctions within the statutory window.
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Grounds of Appeal & Factual Clarifications</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  placeholder="Detail any procedural irregularities, new exculpatory evidence, or disproportionate severity of sanction..."
                  value={grounds}
                  onChange={(e) => setGrounds(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Send size={15} />
                <span>{loading ? 'Transmitting Appeal...' : 'Submit Formal Appeal to Appellate Board'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

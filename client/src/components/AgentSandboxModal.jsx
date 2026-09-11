import React, { useState } from 'react';
import { X, Bot, Shield, Send, CheckCircle, Lock, Eye, RefreshCw } from './Icons';
import { api } from '../api/client';

export function AgentSandboxModal({ onClose, onCaseCreated }) {
  const [activeTab, setActiveTab] = useState('agent44');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Agent 44 trigger state
  const [a44StudentRoll, setA44StudentRoll] = useState('22BCE1048');
  const [a44StudentName, setA44StudentName] = useState('Rohan Sharma');
  const [a44Category, setA44Category] = useState('ACADEMIC_MALPRACTICE');
  const [a44Allegation, setA44Allegation] = useState('Ingested from Automated Proctoring Telemetry: Secondary display tab detected during online quiz evaluation.');

  // Privacy Shield test roll number
  const [shieldRoll, setShieldRoll] = useState('22BCE1048');

  async function handleTriggerAgent44() {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.ingestAgent44({
        sourceAgent: 'Agent 44 (Automated Student Life Ingestion)',
        studentRoll: a44StudentRoll,
        studentName: a44StudentName,
        category: a44Category,
        allegation: a44Allegation,
        witnesses: ['Proctorial System Telemetry Agent', 'Lab Admin K. Suresh']
      });
      setResult({ type: 'Agent 44 Ingress Success', data: res });
      if (onCaseCreated) onCaseCreated();
    } catch (err) {
      setResult({ type: 'Error', error: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleFetchAgent56() {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.getAgent56Feed();
      setResult({ type: 'Agent 56 Compliance Feed (Egress)', data: res });
    } catch (err) {
      setResult({ type: 'Error', error: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleFetchAgent57() {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.getAgent57Feed();
      setResult({ type: 'Agent 57 Precedent Registry (Egress)', data: res });
    } catch (err) {
      setResult({ type: 'Error', error: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleTestPrivacyShield() {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.getStudentProfilePrivacyCheck(shieldRoll);
      setResult({ type: 'Faculty / Placement Portal Privacy Shield Test', data: res });
    } catch (err) {
      setResult({ type: 'Error', error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '850px' }}>
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
              <Bot size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#0a2540' }}>
                Multi-Agent Integration Testbench & Guardrails
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Interoperability Sandbox: Consumes Agent 44 • Feeds Agents 56 & 57 • Verifies Privacy Shield
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '0.5rem 1.5rem 0', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${activeTab === 'agent44' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            onClick={() => { setActiveTab('agent44'); setResult(null); }}
          >
            📥 Agent 44 Ingress
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'agent56' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            onClick={() => { setActiveTab('agent56'); setResult(null); }}
          >
            📤 Agent 56 Compliance Feed
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'agent57' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            onClick={() => { setActiveTab('agent57'); setResult(null); }}
          >
            📤 Agent 57 Precedent Feed
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'privacy' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            onClick={() => { setActiveTab('privacy'); setResult(null); }}
          >
            🛡️ Privacy Shield Check
          </button>
        </div>

        <div className="modal-body">
          {/* TAB 1: AGENT 44 INGRESS */}
          {activeTab === 'agent44' && (
            <div>
              <div className="guardrail-box" style={{ marginBottom: '1.25rem' }}>
                <Shield size={20} style={{ color: '#16a34a' }} />
                <div style={{ fontSize: '0.8rem', color: '#065f46' }}>
                  <strong>Strict Guardrail Enforced:</strong> Incident ingestion from Agent 44 registers an allegation record only. The agent never infers guilt, recommends sanctions, or evaluates evidentiary weight.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Student Roll Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={a44StudentRoll}
                    onChange={(e) => setA44StudentRoll(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Student Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={a44StudentName}
                    onChange={(e) => setA44StudentName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Offence Category</label>
                <select
                  className="form-select"
                  value={a44Category}
                  onChange={(e) => setA44Category(e.target.value)}
                >
                  <option value="ACADEMIC_MALPRACTICE">Academic Malpractice</option>
                  <option value="CAMPUS_MISCONDUCT">Campus Misconduct</option>
                  <option value="ANTI_RAGGING_HARASSMENT">Anti-Ragging / Harassment</option>
                  <option value="EXAMINATION_INFRACTION">Examination Malpractice</option>
                  <option value="SUBSTANCE_ABUSE_VIOLATION">Substance Abuse</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Incident Telemetry / Allegation Payload</label>
                <textarea
                  className="form-textarea"
                  value={a44Allegation}
                  onChange={(e) => setA44Allegation(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleTriggerAgent44}
                disabled={loading}
              >
                <Send size={16} />
                <span>{loading ? 'Ingesting via Agent 44...' : 'Simulate Agent 44 Incident Ingress'}</span>
              </button>
            </div>
          )}

          {/* TAB 2: AGENT 56 COMPLIANCE FEED */}
          {activeTab === 'agent56' && (
            <div>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
                EduGuard serves a real-time compliance feed for <strong>Agent 56 (Institutional Regulatory & Compliance Agent)</strong> with procedural adherence rates, gatekeeper satisfaction stamps, and cryptographic audit proofs.
              </p>

              <button
                className="btn btn-primary"
                onClick={handleFetchAgent56}
                disabled={loading}
                style={{ marginBottom: '1.25rem' }}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin-slow' : ''} />
                <span>Fetch Agent 56 Compliance Feed</span>
              </button>
            </div>
          )}

          {/* TAB 3: AGENT 57 PRECEDENT FEED */}
          {activeTab === 'agent57' && (
            <div>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
                EduGuard exports an anonymised precedent taxonomy for <strong>Agent 57 (Governance & Precedent Registry Agent)</strong> to enable institutional uniformity across campuses without storing identifiable student data.
              </p>

              <button
                className="btn btn-primary"
                onClick={handleFetchAgent57}
                disabled={loading}
                style={{ marginBottom: '1.25rem' }}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin-slow' : ''} />
                <span>Fetch Agent 57 Precedent Feed</span>
              </button>
            </div>
          )}

          {/* TAB 4: PRIVACY SHIELD CHECK */}
          {activeTab === 'privacy' && (
            <div>
              <div className="guardrail-box" style={{ marginBottom: '1.25rem' }}>
                <Shield size={20} style={{ color: '#16a34a' }} />
                <div style={{ fontSize: '0.8rem', color: '#065f46' }}>
                  <strong>Mandatory Privacy Guardrail:</strong> Disciplinary flags must never surface in general student profiles visible to faculty, placement coordinators, or company recruiters.
                </div>
              </div>

              <div className="form-group" style={{ maxWidth: '350px' }}>
                <label className="form-label">Query Student Roll Number</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={shieldRoll}
                    onChange={(e) => setShieldRoll(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleTestPrivacyShield}
                    disabled={loading}
                  >
                    <Eye size={16} /> Check View
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Result JSON Viewer */}
          {result && (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0a2540', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Response Payload: {result.type}</span>
                <span className="badge badge-green">200 OK</span>
              </div>
              <pre style={{
                background: '#0a2540',
                color: '#e2e8f0',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                maxHeight: '260px',
                overflowY: 'auto'
              }}>
                {JSON.stringify(result.data || result.error, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
}

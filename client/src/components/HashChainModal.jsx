import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle, AlertTriangle, RefreshCw, Hash } from './Icons';
import { api } from '../api/client';

export function HashChainModal({ caseId, onClose }) {
  const [chain, setChain] = useState([]);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    loadChain();
  }, [caseId]);

  async function loadChain() {
    setLoading(true);
    try {
      const res = await api.getAuditChain(caseId);
      setChain(res.blocks || []);
      setVerification(res.verification);
    } catch (err) {
      console.error('Failed to load audit chain:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    setVerifying(true);
    try {
      const res = await api.verifyIntegrity(caseId);
      setVerification(res.verification);
    } catch (err) {
      console.error('Failed to verify chain:', err);
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '900px' }}>
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
              <Lock size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#0a2540' }}>
                Cryptographic Tamper-Evident Ledger
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                SHA-256 Hash Chain Audit Trail for Case {caseId}
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Verification Status Banner */}
          {verification && (
            <div style={{
              background: verification.isValid ? '#ecfdf5' : '#fef2f2',
              border: `1px solid ${verification.isValid ? '#a7f3d0' : '#fecaca'}`,
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {verification.isValid ? (
                  <CheckCircle size={24} style={{ color: '#059669' }} />
                ) : (
                  <AlertTriangle size={24} style={{ color: '#dc2626' }} />
                )}
                <div>
                  <h4 style={{ fontSize: '0.925rem', color: verification.isValid ? '#065f46' : '#991b1b', marginBottom: '0.15rem' }}>
                    {verification.isValid ? 'Tamper-Evident Integrity: Cryptographically Valid' : 'Integrity Alert: Chain Tampering Detected!'}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: verification.isValid ? '#047857' : '#b91c1c' }}>
                    {verification.message || verification.reason}
                  </p>
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleVerify}
                disabled={verifying}
              >
                <RefreshCw size={14} className={verifying ? 'animate-spin-slow' : ''} />
                <span>{verifying ? 'Verifying...' : 'Re-verify Hashes'}</span>
              </button>
            </div>
          )}

          {/* Chain blocks list */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              Loading cryptographic ledger blocks...
            </div>
          ) : chain.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              No ledger entries recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {chain.map((block, idx) => (
                <div
                  key={block.id || idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1rem',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-blue" style={{ fontFamily: 'var(--font-mono)' }}>
                        Block #{block.index}
                      </span>
                      <strong style={{ fontSize: '0.85rem', color: '#0a2540' }}>{block.action}</strong>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {new Date(block.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#334155', marginBottom: '0.6rem' }}>
                    <strong>Actor:</strong> {block.actor}
                  </div>

                  {/* Hashes */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.6rem',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: '#64748b', width: '75px' }}>Prev Hash:</span>
                      <span style={{ color: '#0284c7', wordBreak: 'break-all' }}>{block.previousHash}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: '#64748b', width: '75px' }}>Block Hash:</span>
                      <span style={{ color: '#16a34a', fontWeight: 600, wordBreak: 'break-all' }}>{block.hash}</span>
                    </div>
                  </div>

                  {/* Connector Arrow */}
                  {idx < chain.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-14px',
                      left: '26px',
                      width: '2px',
                      height: '14px',
                      background: '#94a3b8'
                    }}></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close Ledger Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

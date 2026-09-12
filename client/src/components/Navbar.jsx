import React, { useState } from 'react';
import { AgentLogo } from './AgentLogo';
import { Shield, Scale, User, TrendingUp, Layers, Plus, Lock, Bot, Play } from './Icons';
import { soundFx } from '../utils/audioFx';

export function Navbar({
  activeRole,
  setActiveRole,
  currentView,
  setCurrentView,
  onOpenIntake,
  onOpenSandbox,
  onReplaySplash
}) {
  const [isMuted, setIsMuted] = useState(() => soundFx.getMuted());

  function toggleSound() {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
    if (!next) soundFx.playClick();
  }

  const roles = [
    { id: 'admin', label: 'Disciplinary Admin', desc: 'Case intake & checklist enforcement' },
    { id: 'committee', label: 'Committee Member', desc: 'Precedent review & fair sentencing' },
    { id: 'student', label: 'Student (Rohan - 22BCE1048)', desc: 'Notices & right to respond' },
    { id: 'governance', label: 'Governance Officer', desc: 'Zero-PII aggregate trends & audits' }
  ];

  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Guardrail & Compliance Sub-Header */}
      <div style={{
        background: '#07152b',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.4rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.74rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#4ade80', fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', display: 'inline-block' }} />
            <span>Guilt-Neutrality Guardrail: <strong>ENFORCED</strong></span>
          </div>
          <span style={{ color: '#334155' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#60a5fa', fontWeight: 600 }}>
            <Lock size={12} />
            <span>SHA-256 Ledger: <strong>ACTIVE</strong></span>
          </div>
          <span style={{ color: '#334155' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#c084fc', fontWeight: 600 }}>
            <Shield size={12} />
            <span>Faculty & Placement Shield: <strong>ACTIVE</strong></span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={toggleSound}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
            title={isMuted ? 'Unmute UI Audio FX' : 'Mute UI Audio FX'}
          >
            <span>{isMuted ? '🔇 Audio Off' : '🔊 Audio On'}</span>
          </button>

          <span style={{ color: '#334155' }}>|</span>

          <button
            onClick={() => {
              soundFx.playClick();
              onReplaySplash();
            }}
            style={{
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              padding: '0.15rem 0.55rem',
              borderRadius: '9999px',
              fontSize: '0.68rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
            title="Replay opening flash screen & zoom animation"
          >
            <Play size={10} />
            <span>Replay Intro</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="app-container" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand with New Crest Logo */}
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            soundFx.playClick();
            setCurrentView('intro');
          }}
        >
          <AgentLogo size={42} showText={true} glowing={true} />
        </div>

        {/* View Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '10px' }}>
          <button
            className={`btn btn-sm ${currentView === 'intro' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
            onClick={() => {
              soundFx.playClick();
              setCurrentView('intro');
            }}
          >
            <Bot size={14} /> Agent Overview
          </button>

          <button
            className={`btn btn-sm ${currentView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
            onClick={() => {
              soundFx.playClick();
              setCurrentView('dashboard');
            }}
          >
            <Layers size={14} /> Case Workspace
          </button>

          <button
            className={`btn btn-sm ${currentView === 'committee' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
            onClick={() => {
              soundFx.playClick();
              setActiveRole('committee');
              setCurrentView('committee');
            }}
          >
            <Scale size={14} /> Committee Desk
          </button>

          <button
            className={`btn btn-sm ${currentView === 'student' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
            onClick={() => {
              soundFx.playClick();
              setActiveRole('student');
              setCurrentView('student');
            }}
          >
            <User size={14} /> Student Portal
          </button>

          <button
            className={`btn btn-sm ${currentView === 'governance' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
            onClick={() => {
              soundFx.playClick();
              setActiveRole('governance');
              setCurrentView('governance');
            }}
          >
            <TrendingUp size={14} /> Governance & Trends
          </button>
        </nav>

        {/* Action Controls & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Agent Sandbox Button (Ingress 44 / Egress 56,57) */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              soundFx.playClick();
              onOpenSandbox();
            }}
            title="Inspect Agent 44 Ingress and Agent 56/57 Egress contracts"
          >
            <Bot size={14} style={{ color: '#2563eb' }} />
            <span>Agent Sandbox</span>
          </button>

          {/* New Case Button */}
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              soundFx.playClick();
              onOpenIntake();
            }}
          >
            <Plus size={14} />
            <span>New Case</span>
          </button>

          {/* Role Switcher Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>Role:</span>
            <select
              value={activeRole}
              onChange={(e) => {
                const newRole = e.target.value;
                soundFx.playClick();
                setActiveRole(newRole);
                if (newRole === 'student') setCurrentView('student');
                else if (newRole === 'committee') setCurrentView('committee');
                else if (newRole === 'governance') setCurrentView('governance');
                else if (newRole === 'admin') setCurrentView('dashboard');
              }}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#0a2540',
                cursor: 'pointer'
              }}
            >
              {roles.map(r => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}

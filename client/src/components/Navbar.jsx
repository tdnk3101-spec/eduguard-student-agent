import React from 'react';
import { VignanBanner } from './VignanBanner';
import { Shield, Scale, User, TrendingUp, Layers, Plus, Lock, Bot } from './Icons';

export function Navbar({ activeRole, setActiveRole, currentView, setCurrentView, onOpenIntake, onOpenSandbox }) {
  const roles = [
    { id: 'admin', label: 'Disciplinary Admin', icon: Shield, desc: 'Case & policy management' },
    { id: 'committee', label: 'Committee Member', icon: Scale, desc: 'Review & record findings' },
    { id: 'student', label: 'Student (Rohan - 22BCE1048)', icon: User, desc: 'Notices & right to respond' },
    { id: 'governance', label: 'Governance Officer', icon: TrendingUp, desc: 'Zero-PII trends & audits' }
  ];

  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
      {/* Official Institutional Header Banner matching user image */}
      <VignanBanner />

      {/* Guardrail & Compliance Sub-Header */}
      <div style={{
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.45rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#16a34a', fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span>
            <span>Guilt-Neutrality Guardrail: <strong>ENFORCED</strong></span>
          </div>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#2563eb', fontWeight: 600 }}>
            <Lock size={12} />
            <span>SHA-256 Ledger: <strong>ACTIVE</strong></span>
          </div>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#7c3aed', fontWeight: 600 }}>
            <Shield size={12} />
            <span>Faculty & Placement Privacy Shield: <strong>ACTIVE</strong></span>
          </div>
        </div>

        <div style={{ color: '#64748b', fontSize: '0.72rem' }}>
          Procedural Fairness Protocol v2.4 • Due Process Guarantee
        </div>
      </div>

      {/* Main Navbar */}
      <div className="app-container" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }} onClick={() => setCurrentView('dashboard')}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.22)'
          }}>
            <Shield size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.2rem', color: '#0a2540', lineHeight: 1.2 }}>EduGuard</h1>
              <span className="badge badge-blue" style={{ fontSize: '0.68rem', padding: '0.12rem 0.5rem' }}>
                Student Discipline Agent
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Policy Compliance & Due Process Management Platform
            </p>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: '10px' }}>
          <button
            className={`btn btn-sm ${currentView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
            onClick={() => setCurrentView('dashboard')}
          >
            <Layers size={14} /> Case Register
          </button>
          
          <button
            className={`btn btn-sm ${currentView === 'committee' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
            onClick={() => {
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
              setActiveRole('governance');
              setCurrentView('governance');
            }}
          >
            <TrendingUp size={14} /> Governance & Trends
          </button>
        </nav>

        {/* Action Controls & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Agent Sandbox Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenSandbox}
            title="Inspect Agent 44 Ingress and Agent 56/57 Egress contracts"
          >
            <Bot size={14} style={{ color: '#2563eb' }} />
            <span>Agent Sandbox</span>
          </button>

          {/* New Incident Button */}
          <button
            className="btn btn-primary btn-sm"
            onClick={onOpenIntake}
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

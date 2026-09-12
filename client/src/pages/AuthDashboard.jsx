import React, { useState } from 'react';
import { AgentLogo } from '../components/AgentLogo';
import { soundFx } from '../utils/audioFx';
import { Shield, Lock, Scale, User, TrendingUp, CheckCircle, Bot, Sparkles, FileText } from '../components/Icons';

export function AuthDashboard({ currentUser, onLoginSuccess, onLogout, onNavigateToRole }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollEmpId, setRollEmpId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const demoAccounts = [
    {
      role: 'admin',
      title: 'Disciplinary Administrator',
      name: 'Dr. K. V. Rao',
      email: 'dean.discipline@vignan.ac.in',
      id: 'FAC-EMP-1042',
      dept: 'Office of Student Affairs',
      badgeColor: '#2563eb',
      desc: 'Case intake, policy gating checklist, and notice dispatch'
    },
    {
      role: 'committee',
      title: 'Disciplinary Committee Member',
      name: 'Prof. S. N. Murthy',
      email: 'murthy.sn@vignan.ac.in',
      id: 'FAC-EMP-2091',
      dept: 'Computer Science & Engineering',
      badgeColor: '#7c3aed',
      desc: 'Review evidence, inspect similarity precedents, and record deliberations'
    },
    {
      role: 'student',
      title: 'Student Respondent (Rohan)',
      name: 'Rohan Sharma',
      email: 'rohan.22bce1048@vignan.ac.in',
      id: '22BCE1048',
      dept: 'Computer Science & Engineering',
      badgeColor: '#059669',
      desc: 'Acknowledge statutory notices, submit rebuttal statement, file appeal'
    },
    {
      role: 'governance',
      title: 'Institutional Governance Officer',
      name: 'Dr. M. S. Reddy',
      email: 'ombudsperson@vignan.ac.in',
      id: 'GOV-AUDIT-004',
      dept: 'Academic Governance & Oversight',
      badgeColor: '#ea580c',
      desc: 'Zero-PII demographic parity audit and statutory procedural compliance'
    }
  ];

  function handleQuickLogin(account) {
    soundFx.playClick();
    soundFx.playChime();
    setSuccessMsg(`Authenticated as ${account.name} (${account.title})!`);
    setTimeout(() => {
      onLoginSuccess({
        name: account.name,
        email: account.email,
        id: account.id,
        dept: account.dept,
        role: account.role
      });
      onNavigateToRole && onNavigateToRole(account.role);
    }, 500);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setError('Please enter your institutional email and password.');
        return;
      }

      soundFx.playClick();
      soundFx.playChime();
      setSuccessMsg('Session verified. Redirecting to workspace...');
      setTimeout(() => {
        onLoginSuccess({
          name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          email: email.trim(),
          id: 'EMP-SES-' + Math.floor(1000 + Math.random() * 9000),
          dept: 'Computer Science & Engineering',
          role: selectedRole
        });
        onNavigateToRole && onNavigateToRole(selectedRole);
      }, 500);
    } else {
      if (!name.trim() || !email.trim() || !password.trim() || !rollEmpId.trim()) {
        setError('Please complete all required fields.');
        return;
      }

      soundFx.playClick();
      soundFx.playChime();
      setSuccessMsg(`Welcome, ${name}! Institutional account registered.`);
      setTimeout(() => {
        onLoginSuccess({
          name: name.trim(),
          email: email.trim(),
          id: rollEmpId.trim().toUpperCase(),
          dept: department,
          role: selectedRole
        });
        onNavigateToRole && onNavigateToRole(selectedRole);
      }, 500);
    }
  }

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #07152b 0%, #0f172a 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '2rem 2.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <AgentLogo size={52} showText={false} glowing={true} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Institutional Access & Identity Portal
              </h2>
              <span style={{
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                padding: '0.15rem 0.6rem',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 700
              }}>
                Agent 47 Auth v2.6
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
              Single Sign-On (SSO) gateway for Disciplinary Administrators, Committee Members, Students, and Governance Auditors.
            </p>
          </div>
        </div>

        {currentUser && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.07)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>CURRENTLY LOGGED IN</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#4ade80' }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>{currentUser.id} • {currentUser.role.toUpperCase()}</div>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                onLogout();
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Main Authentication Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: 1-Click Role Profiles & Security Pillars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0a2540', margin: 0 }}>
                  Instant Role-Based Access
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                  Select an institutional persona to immediately inspect role-specific dashboards.
                </p>
              </div>
              <Sparkles size={20} style={{ color: '#f59e0b' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {demoAccounts.map((acc) => (
                <div
                  key={acc.role}
                  onClick={() => handleQuickLogin(acc)}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1rem 1.15rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = acc.badgeColor;
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.06)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      background: acc.badgeColor,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      boxShadow: `0 4px 10px ${acc.badgeColor}40`
                    }}>
                      {acc.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0a2540' }}>{acc.name}</span>
                        <span style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: acc.badgeColor,
                          background: `${acc.badgeColor}15`,
                          padding: '0.1rem 0.45rem',
                          borderRadius: '4px'
                        }}>
                          {acc.title}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.15rem' }}>
                        {acc.desc}
                      </div>
                    </div>
                  </div>

                  <button
                    style={{
                      background: 'transparent',
                      border: `1px solid ${acc.badgeColor}`,
                      color: acc.badgeColor,
                      borderRadius: '8px',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    Launch →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Guilt Neutrality Assurance */}
          <div className="card" style={{ padding: '1.5rem', background: '#0a1a2f', color: '#ffffff', border: '1px solid #1e293b' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={16} />
              <span>Cryptographic Governance & Guilt-Neutrality Guardrails</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.78rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#4ade80' }}>✓</span>
                <span><strong>Guilt-Neutrality Protocol:</strong> Authentication does not bias investigation outcomes; respondents maintain complete presumption of innocence.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#4ade80' }}>✓</span>
                <span><strong>SHA-256 Audit Chain:</strong> Every login, view, notice delivery, and rebuttal statement is hashed into the tamper-evident audit ledger.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#4ade80' }}>✓</span>
                <span><strong>Placement Shield:</strong> Non-adjudicated disciplinary inquiries are strictly blocked from external recruiter or placement APIs.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login / Signup Form */}
        <div className="card" style={{ padding: '2rem' }}>
          {/* Mode Switcher */}
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '0.25rem',
            borderRadius: '10px',
            marginBottom: '1.5rem'
          }}>
            <button
              onClick={() => {
                soundFx.playClick();
                setMode('login');
                setError('');
              }}
              style={{
                flex: 1,
                padding: '0.55rem',
                border: 'none',
                borderRadius: '8px',
                background: mode === 'login' ? '#ffffff' : 'transparent',
                color: mode === 'login' ? '#0a2540' : '#64748b',
                fontWeight: 800,
                fontSize: '0.82rem',
                boxShadow: mode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Institutional Login
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setMode('signup');
                setError('');
              }}
              style={{
                flex: 1,
                padding: '0.55rem',
                border: 'none',
                borderRadius: '8px',
                background: mode === 'signup' ? '#ffffff' : 'transparent',
                color: mode === 'signup' ? '#0a2540' : '#64748b',
                fontWeight: 800,
                fontSize: '0.82rem',
                boxShadow: mode === 'signup' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              marginBottom: '1.25rem'
            }}>
              ⚠️ {error}
            </div>
          )}

          {successMsg && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              marginBottom: '1.25rem'
            }}>
              ✓ {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'signup' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Ramesh Kumar"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                      Roll / Faculty ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={rollEmpId}
                      onChange={(e) => setRollEmpId(e.target.value)}
                      placeholder="e.g. 22BCE1048"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                      Primary Role *
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        background: '#ffffff'
                      }}
                    >
                      <option value="admin">Disciplinary Admin</option>
                      <option value="committee">Committee Member</option>
                      <option value="student">Student Respondent</option>
                      <option value="governance">Governance Auditor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Department / Faculty *
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                University Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="id@vignan.ac.in"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            {mode === 'login' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Intended Workspace View
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    background: '#ffffff'
                  }}
                >
                  <option value="admin">Disciplinary Administrator Dashboard</option>
                  <option value="committee">Disciplinary Committee Desk</option>
                  <option value="student">Student Respondent Portal</option>
                  <option value="governance">Institutional Governance & Auditing</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                padding: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                marginTop: '0.5rem',
                justifyContent: 'center'
              }}
            >
              {mode === 'login' ? 'Authenticate & Enter Dashboard →' : 'Register & Enter Dashboard →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

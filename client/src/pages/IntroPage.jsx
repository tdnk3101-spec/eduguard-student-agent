import React from 'react';
import { Shield, Scale, Clock, Lock, CheckCircle, FileText, Bot, ArrowRight, Plus, ExternalLink } from '../components/Icons';

export function IntroPage({ onNavigateToWorkspace, onOpenIntake, onOpenSandbox, onSelectRole }) {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #070e1e 0%, #0d1e38 50%, #162b4d 100%)',
        color: '#ffffff',
        borderRadius: '24px',
        padding: '3.5rem 3rem',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(7, 14, 30, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Ambient Glows */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, rgba(37, 99, 235, 0) 70%)',
          pointerEvents: 'none'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-25%',
          left: '10%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0) 70%)',
          pointerEvents: 'none'
        }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px' }}>
          {/* Institutional Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '0.35rem 0.9rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#60a5fa',
            marginBottom: '1.25rem'
          }}>
            <Bot size={15} style={{ color: '#38bdf8' }} />
            <span>Vignan's CSE presents Agentic AI Day 2026 • Autonomous Governance Agent</span>
          </div>

          <h1 style={{
            fontSize: '2.75rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-heading)',
            color: '#ffffff',
            marginBottom: '1.25rem'
          }}>
            EduGuard — Student Discipline & Due Process Agent
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: '#cbd5e1',
            lineHeight: 1.6,
            marginBottom: '2rem',
            maxWidth: '820px'
          }}>
            An autonomous institutional intelligence system that enforces university disciplinary policy with 
            strict procedural fairness. Removes arbitrary bias, automates statutory notices, protects student 
            due process rights, and seals every action in a tamper-evident SHA-256 cryptographic audit ledger.
          </p>

          {/* Primary Call to Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={onNavigateToWorkspace}
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                padding: '0.85rem 1.75rem',
                fontSize: '1rem',
                borderRadius: '10px',
                fontWeight: 700,
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
              }}
            >
              <span>Launch Case Workspace</span>
              <ArrowRight size={18} />
            </button>

            <button
              className="btn btn-secondary"
              onClick={onOpenIntake}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.85rem 1.5rem',
                fontSize: '0.95rem',
                borderRadius: '10px',
                fontWeight: 600
              }}
            >
              <Plus size={16} />
              <span>File New Incident</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={onOpenSandbox}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#93c5fd',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '0.85rem 1.5rem',
                fontSize: '0.95rem',
                borderRadius: '10px',
                fontWeight: 600
              }}
            >
              <Bot size={16} />
              <span>Multi-Agent Sandbox</span>
            </button>
          </div>
        </div>

        {/* Live Guardrails HUD Bar */}
        <div style={{
          marginTop: '2.5rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4ade80', fontSize: '0.72rem', fontWeight: 700 }}>
              <CheckCircle size={14} />
              <span>GUARDRAIL 1: GUILT NEUTRAL</span>
            </div>
            <div style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800, marginTop: '0.2rem' }}>
              0 Automated Verdicts
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
              Findings reserved exclusively for Statutory Committee
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa', fontSize: '0.72rem', fontWeight: 700 }}>
              <CheckCircle size={14} />
              <span>GUARDRAIL 2: POLICY GATING</span>
            </div>
            <div style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800, marginTop: '0.2rem' }}>
              100% Gated Fairness
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
              Notice served + response window + quorum verified
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a78bfa', fontSize: '0.72rem', fontWeight: 700 }}>
              <CheckCircle size={14} />
              <span>GUARDRAIL 3: CRYPTO LEDGER</span>
            </div>
            <div style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800, marginTop: '0.2rem' }}>
              SHA-256 Hashed
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
              Tamper-evident block verification across all cases
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.72rem', fontWeight: 700 }}>
              <CheckCircle size={14} />
              <span>GUARDRAIL 4: PRIVACY SHIELD</span>
            </div>
            <div style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800, marginTop: '0.2rem' }}>
              Zero Faculty Leakage
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
              Disciplinary files masked from placement & academic apps
            </div>
          </div>
        </div>
      </div>

      {/* Official Agent 47 Charter & Specification Card */}
      <div className="card" style={{
        padding: '2rem 2.5rem',
        marginBottom: '3rem',
        borderLeft: '5px solid #2563eb',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 8px 30px rgba(10, 37, 64, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                SYSTEM SPECIFICATION
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Agentic AI 2026 Framework</span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0a2540', marginTop: '0.35rem' }}>
              Agent 47. Student Discipline Agent
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
              Consumes: Agent 44
            </span>
            <span style={{ background: '#f3e8ff', color: '#6b21a8', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
              Feeds: Agents 56 & 57
            </span>
          </div>
        </div>

        {/* 4-Box Specification Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#ffffff', padding: '1.1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              1. Core Purpose
            </div>
            <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
              Maintains disciplinary records and supports due process, ensuring proceedings follow the institution’s own stated procedure consistently rather than varying with who is handling the case.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '1.1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              2. Primary Users
            </div>
            <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
              Disciplinary Committee, Deans of Student Affairs, Heads of Department (HODs), and Central University Administration.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '1.1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              3. Inputs & Ingress
            </div>
            <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
              Incident reports (date, location, persons, witnesses, evidence), disciplinary policy clauses, sanction ranges, committee records, student records, precedent case history.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '1.1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              4. Outputs & Egress
            </div>
            <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
              Case registers, procedural compliance checklists, notices and orders, precedent summaries, sanction trackers, and anonymised trend reports.
            </p>
          </div>
        </div>

        {/* Mandatory Guardrail Banner */}
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '1.1rem 1.35rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.85rem'
        }}>
          <Shield size={20} style={{ color: '#dc2626', flexShrink: 0, marginTop: '0.15rem' }} />
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Non-Negotiable System Guardrails
            </div>
            <p style={{ fontSize: '0.8rem', color: '#b91c1c', lineHeight: 1.5, marginTop: '0.25rem' }}>
              <strong>Guilt Neutrality:</strong> This agent must never determine guilt, recommend a sanction, or evaluate evidence. It supports process compliance and record-keeping only.
              <br />
              <strong>Privacy Shield:</strong> Access is restricted to named disciplinary authorities; disciplinary flags never surface in general student profiles visible to faculty or placement staff.
              <br />
              <strong>Automated Retention & Expiry:</strong> Records expire under a defined retention policy so that a first-year incident does not follow a student indefinitely.
            </p>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem' }}>
          <span style={{ color: '#2563eb', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            System Capabilities
          </span>
          <h2 style={{ fontSize: '1.85rem', color: '#0a2540', fontWeight: 800, marginTop: '0.3rem' }}>
            Engineered for Due Process, Transparency & Accountability
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Unlike generic CRUD tools, EduGuard functions as an autonomous legal and procedural referee.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Scale size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#0a2540', fontWeight: 700, marginBottom: '0.5rem' }}>
              Statutory Policy Engine
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: 1.5 }}>
              Automatically maps reported violations to 5 university ordinances (Academic Malpractice, Campus Conduct, Anti-Ragging, Examination, Substance Abuse) and constructs non-negotiable procedural checklists.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#0a2540', fontWeight: 700, marginBottom: '0.5rem' }}>
              Strict Guilt Neutrality
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: 1.5 }}>
              The agent never pronounces guilt or selects punishments autonomously. It enforces standard-of-proof deliberation and locks sanction recording until formal notice, student reply, and committee quorum are confirmed.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#faf5ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Lock size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#0a2540', fontWeight: 700, marginBottom: '0.5rem' }}>
              SHA-256 Tamper-Evident Ledger
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: 1.5 }}>
              Every piece of evidence, witness testimony, committee attendance record, formal decision, and appeal is sequentially chained with cryptographic hashes, preventing any administrative tampering or post-facto alteration.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#0a2540', fontWeight: 700, marginBottom: '0.5rem' }}>
              Retention & Automatic Sealing
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: 1.5 }}>
              Implements automated 3-year statutory retention timers. Once completed with sanction fulfillment, disciplinary records are automatically sealed and expunged so students can graduate without permanent stigmatization.
            </p>
          </div>
        </div>
      </div>

      {/* 9-Stage Due-Process Lifecycle Stepper Visualizer */}
      <div className="card" style={{ padding: '2rem 2.5rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Standard Operating Procedure
            </div>
            <h3 style={{ fontSize: '1.35rem', color: '#0a2540', fontWeight: 800 }}>
              The 9-Stage Due-Process Lifecycle Pipeline
            </h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onNavigateToWorkspace}>
            <span>View Live Cases in Pipeline</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            { stage: 1, title: 'Incident Intake', desc: 'Captures location, date, reporter & generates unique Case ID' },
            { stage: 2, title: 'Policy Classification', desc: 'Engine matches violation to statutory ordinance & sets checklist' },
            { stage: 3, title: 'Notice Dispatch', desc: 'Issues statutory formal charge sheet with response deadline' },
            { stage: 4, title: 'Right to be Heard', desc: 'Student reviews allegation & submits statement & evidence' },
            { stage: 5, title: 'Quorum & Hearing', desc: 'Validates committee composition & records oral proceedings' },
            { stage: 6, title: 'Findings of Fact', desc: 'Committee deliberates on balance-of-probabilities standard' },
            { stage: 7, title: 'Policy Sanction', desc: 'Selects penalty strictly from approved policy matrix' },
            { stage: 8, title: 'Statutory Appeal', desc: '14-day window for student to petition Appellate Tribunal' },
            { stage: 9, title: 'Retention & Sealing', desc: 'Tracks sanction compliance & starts automated expungement timer' }
          ].map((item) => (
            <div
              key={item.stage}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.15rem',
                position: 'relative'
              }}
            >
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '0.75rem'
              }}>
                {item.stage}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0a2540', marginBottom: '0.35rem' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Agent Ecosystem Interop */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '20px',
        padding: '2.5rem',
        color: '#ffffff',
        marginBottom: '3rem',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ maxWidth: '750px', marginBottom: '2rem' }}>
          <div style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Agentic Interoperability
          </div>
          <h3 style={{ fontSize: '1.5rem', color: '#ffffff', fontWeight: 800, marginBottom: '0.5rem' }}>
            Autonomous Multi-Agent Collaboration Fabric
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
            EduGuard seamlessly connects upstream and downstream across institutional micro-agents while strictly shielding student data from untrusted networks.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {/* Agent 44 */}
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div style={{ padding: '0.4rem', background: '#3b82f6', borderRadius: '8px' }}>
                <Bot size={18} style={{ color: '#ffffff' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: 700 }}>INGRESS PARTNER</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>Hostel & Campus Security</div>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
              Transmits raw digital incident logs, security incident reports, and curfew logs directly into EduGuard Stage 1 intake.
            </p>
          </div>

          {/* EduGuard */}
          <div style={{ background: 'rgba(37, 99, 235, 0.15)', border: '2px solid #3b82f6', borderRadius: '14px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div style={{ padding: '0.4rem', background: '#2563eb', borderRadius: '8px' }}>
                <Shield size={18} style={{ color: '#ffffff' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: 800 }}>CORE AGENT</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>EduGuard (Due Process)</div>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#e2e8f0', lineHeight: 1.45 }}>
              Executes the policy engine, validates checklists, enforces quorum, facilitates right to be heard, and seals records in SHA-256 ledger.
            </p>
          </div>

          {/* Agent 56 & 57 */}
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div style={{ padding: '0.4rem', background: '#8b5cf6', borderRadius: '8px' }}>
                <Scale size={18} style={{ color: '#ffffff' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#c4b5fd', fontWeight: 700 }}>EGRESS & MEMORY</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>UGC Compliance & Precedents</div>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
              Synchronizes statutory reports to UGC grievance bodies (Agent 56) and queries historical legal precedents for penalty parity (Agent 57).
            </p>
          </div>
        </div>
      </div>

      {/* Role-Based Testing Entry Points */}
      <div>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 1.75rem' }}>
          <span style={{ color: '#2563eb', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Interactive Personas
          </span>
          <h2 style={{ fontSize: '1.65rem', color: '#0a2540', fontWeight: 800, marginTop: '0.2rem' }}>
            Experience EduGuard from Every Stakeholder Viewpoint
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div
            className="card"
            style={{ padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => onSelectRole('admin')}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2563eb'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary">Disciplinary Proctor</span>
              <ArrowRight size={16} style={{ color: '#2563eb' }} />
            </div>
            <div style={{ fontWeight: 700, color: '#0a2540', fontSize: '1rem', marginBottom: '0.25rem' }}>
              Administrative Command Center
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Full case registry, incident intake, formal notice generation, and SHA-256 audit ledger inspection.
            </div>
          </div>

          <div
            className="card"
            style={{ padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => onSelectRole('committee')}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#7c3aed'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="badge" style={{ background: '#faf5ff', color: '#7c3aed', border: '1px solid #e9d5ff' }}>Committee Member</span>
              <ArrowRight size={16} style={{ color: '#7c3aed' }} />
            </div>
            <div style={{ fontWeight: 700, color: '#0a2540', fontSize: '1rem', marginBottom: '0.25rem' }}>
              Hearing & Deliberation Desk
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Quorum verification, witness statements, standard of proof voting, and policy-bounded sanction recording.
            </div>
          </div>

          <div
            className="card"
            style={{ padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => onSelectRole('student')}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#16a34a'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="badge" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>Student (Rohan Sharma)</span>
              <ArrowRight size={16} style={{ color: '#16a34a' }} />
            </div>
            <div style={{ fontWeight: 700, color: '#0a2540', fontSize: '1rem', marginBottom: '0.25rem' }}>
              Student Due Process Portal
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Notice acknowledgment, written statement submission, evidence defense, and statutory appeal filing.
            </div>
          </div>

          <div
            className="card"
            style={{ padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => onSelectRole('governance')}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d97706'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="badge" style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}>Governance Officer</span>
              <ArrowRight size={16} style={{ color: '#d97706' }} />
            </div>
            <div style={{ fontWeight: 700, color: '#0a2540', fontSize: '1rem', marginBottom: '0.25rem' }}>
              Compliance & Retention Audit
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Procedural turnaround metrics, privacy isolation verification, and 3-year automated expungement ledger.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

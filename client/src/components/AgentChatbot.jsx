import React, { useState, useEffect, useRef } from 'react';
import { AgentLogo } from './AgentLogo';
import { soundFx } from '../utils/audioFx';
import { Bot, Shield, Scale, Send, X, RotateCcw, Sparkles } from './Icons';
import { api } from '../api/client';

// Fallback intelligent offline inference for Netlify & static mode
function getClientOfflineReply(message) {
  const q = message.toLowerCase();

  if (q.includes('due process') || q.includes('checklist') || q.includes('procedure') || q.includes('right')) {
    return {
      text: `### 🛡️ Agent 47 Mandatory Due Process Standards\n\nUnder University Disciplinary Policy **Section IV (Procedural Fairness)**, 5 statutory gates are strictly enforced:\n\n1. **Statutory Written Notice**: Delivered within 48h with specific allegations and evidence citations.\n2. **7-Day Response Window**: Mandatory time for student rebuttal before any committee meeting.\n3. **Evidence Inspection**: Respondent & advisor have unconditional access to reports.\n4. **Impartial Committee**: Balanced constitution with zero conflict of interest.\n5. **14-Day Right of Appeal**: Guaranteed appeal path to the Vice-Chancellor.\n\n*Guilt-Neutrality Guardrail: Verdicts cannot be issued until all 5 steps are signed.*`,
      suggestions: ['Check active case status', 'What is the sanction range?', 'Explain Guilt-Neutrality']
    };
  }

  if (q.includes('sanction') || q.includes('penalty') || q.includes('punishment') || q.includes('range')) {
    return {
      text: `### ⚖️ Institutional Sanction Tier Matrix\n\nPenalties are pre-gated by offence severity to prevent arbitrary decisions:\n\n- **Minor (Category 1)**: Formal reprimand, campus restorative service (max 10h), reflection module.\n- **Moderate (Category 2)**: Disciplinary probation (1 semester), course grade reduction, restitution.\n- **Major (Category 3)**: Suspension for 1–2 academic semesters, hostel de-boarding, transcript note.\n- **Critical (Category 4)**: Permanent expulsion, campus ban, statutory referral.\n\n⚠️ *Sanctions exceeding policy bounds are blocked by the Agent 47 Gating Guardrail.*`,
      suggestions: ['What are the rules for plagiarism?', 'How does precedent matching work?', 'Check appeal deadline']
    };
  }

  if (q.includes('plagiarism') || q.includes('cheat') || q.includes('academic integrity') || q.includes('exam')) {
    return {
      text: `### 📖 Academic Integrity Code (Policy AC-2024)\n\n- **Definition**: Plagiarism (>20% similarity), unauthorized GenAI code generation on exams, or grade tampering.\n- **Mandatory Procedure**: Instructor submits turnitin report & digital logs; student has 7 days to provide source drafts.\n- **Sanction Bounds**: First offence capped at Grade 'F' + formal warning. Repeat offense escalates to semester suspension.`,
      suggestions: ['Open Case Workspace', 'What is the notice requirement?', 'File new incident']
    };
  }

  if (q.includes('guilt') || q.includes('neutral') || q.includes('bias') || q.includes('guardrail')) {
    return {
      text: `### 🔒 Guilt-Neutrality Guardrail Specification\n\nAgent 47 operates under an absolute **non-convicting constitutional architecture**:\n\n1. **Zero Automated Verdicts**: The AI never convicts or labels a student "guilty".\n2. **Procedural Assistance Only**: Compiles case files and tracks statutory timelines.\n3. **Neutral Language**: All notices use objective language ("allegation under inquiry").\n4. **SHA-256 Ledger**: Every step is cryptographically hashed for audit compliance.`,
      suggestions: ['How does the SHA-256 ledger work?', 'What is the student response window?', 'Multi-Agent contracts']
    };
  }

  if (q.includes('agent 44') || q.includes('agent 56') || q.includes('agent 57') || q.includes('contract') || q.includes('multi-agent')) {
    return {
      text: `### 🤖 Multi-Agent Ecosystem Topology\n\n- **Ingress from Agent 44 (Campus Incident Reporter)**: Receives geofenced security reports with cryptographic evidence hashes.\n- **Agent 47 (Discipline & Due Process)**: Gating, statutory checklists, and case compilation.\n- **Egress to Agent 56 (Registrar)**: Dispatches official academic holds (e.g. course registration block).\n- **Egress to Agent 57 (Hostel/Access Control)**: Triggers NFC keycard revocations upon validated suspension.\n\n*Test these live in the **Agent Sandbox** tab!*`,
      suggestions: ['Open Agent Sandbox', 'How do notices work?', 'Show case statistics']
    };
  }

  if (q.includes('sha-256') || q.includes('hash') || q.includes('ledger') || q.includes('chain')) {
    return {
      text: `### ⛓️ Tamper-Evident SHA-256 Cryptographic Chain\n\nEvery event (intake, notice, student rebuttal, vote) is linked in an immutable chain:\n\n\`\`\`\nBlock[N] = SHA-256(Block[N-1] + Timestamp + EventPayload)\n\`\`\`\nAny database tampering breaks the cryptographic hash validation immediately!`,
      suggestions: ['What is due process?', 'Show sanction ranges', 'Check active case status']
    };
  }

  if (q.includes('case') || q.includes('status') || q.includes('rohan')) {
    return {
      text: `### 📊 Case Registry Intelligence\n\n- **Active Benchmark Case**: **CASE-2024-001 (Rohan Sharma - 22BCE1048)**\n- **Allegation**: Unpermitted GenAI exam code assistance\n- **Current Stage**: Committee Review (7-Day Notice Formally Served)\n- **Student Rights**: Right to inspect evidence, submit written statement, and appear with an advisor.`,
      suggestions: ['Open Case Workspace', 'View Committee Desk', 'What are mandatory due-process requirements?']
    };
  }

  return {
    text: `### 🤖 Agent 47 AI Due-Process Advisor\n\nI am your autonomous policy advisor for student disciplinary proceedings. I can assist you with:\n\n- **Policy Gating**: Check offence categories, sanction limits, and mandatory procedural milestones.\n- **Statutory Due Process**: Verify 7-day notice requirements and 14-day appeal deadlines.\n- **Precedent Matching**: Find historical committee rulings for consistent sentencing.\n- **Multi-Agent Contracts**: Explain Ingress from Agent 44 and Egress to Agents 56 & 57.`,
    suggestions: [
      'What are mandatory due-process requirements?',
      'What is the sanction range for cheating?',
      'Explain the Guilt-Neutrality Guardrail',
      'How does Agent 47 integrate with Agent 44 and 56?'
    ]
  };
}

export function AgentChatbot({ activeRole, onNavigate, onOpenIntake, onOpenSandbox }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'agent',
      text: `👋 Greetings! I am **Agent 47 AI Advisor**.\n\nI monitor university disciplinary proceedings for strict **procedural fairness**, **policy gating**, and **guilt-neutrality**.\n\nHow can I assist your inquiry today?`,
      suggestions: [
        'What are mandatory due-process requirements?',
        'What is the sanction range for cheating?',
        'Explain the Guilt-Neutrality Guardrail',
        'How does Agent 47 integrate with Agent 44 and 56?'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  async function handleSend(queryText) {
    const textToSend = (queryText || input).trim();
    if (!textToSend) return;

    soundFx.playClick();

    const userMsg = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    let replyText = '';
    let suggestions = [];

    try {
      // 1. Attempt server API call via robust client
      const res = await api.sendChatMessage(textToSend, activeRole);
      if (res && res.reply) {
        replyText = res.reply;
        suggestions = res.suggestions || [];
      } else {
        throw new Error('Fallback to local intelligence');
      }
    } catch {
      // 2. Seamless client fallback (works on Netlify & static builds)
      const fallback = getClientOfflineReply(textToSend);
      replyText = fallback.text;
      suggestions = fallback.suggestions;
    }

    setTimeout(() => {
      setIsTyping(false);
      soundFx.playChime();
      setMessages(prev => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'agent',
          text: replyText,
          suggestions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 350);
  }

  function handleChipClick(chipText) {
    if (chipText === 'Open Case Workspace') {
      onNavigate && onNavigate('dashboard');
      return;
    }
    if (chipText === 'Open Agent Sandbox') {
      onOpenSandbox && onOpenSandbox();
      return;
    }
    if (chipText === 'File new incident') {
      onOpenIntake && onOpenIntake();
      return;
    }
    if (chipText === 'View Committee Desk') {
      onNavigate && onNavigate('committee');
      return;
    }
    handleSend(chipText);
  }

  function renderFormattedText(text) {
    // Basic markdown-like parser for bolding, bullet points, headers, and code
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} style={{ margin: '0.4rem 0 0.25rem', color: '#0a2540', fontSize: '0.92rem', fontWeight: 800 }}>
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemContent = line.substring(2);
        return (
          <li key={idx} style={{ marginLeft: '1.2rem', marginBottom: '0.2rem', fontSize: '0.82rem', color: '#334155' }}>
            <span dangerouslySetInnerHTML={{ __html: formatInline(itemContent) }} />
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <div key={idx} style={{ marginLeft: '0.8rem', marginBottom: '0.25rem', fontSize: '0.82rem', color: '#334155' }}>
            <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} style={{ height: '0.35rem' }} />;
      }
      return (
        <p key={idx} style={{ margin: '0 0 0.35rem', fontSize: '0.82rem', lineHeight: 1.45, color: '#334155' }}>
          <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        </p>
      );
    });
  }

  function formatInline(str) {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.06); padding: 0.1rem 0.3rem; border-radius: 4px; font-size: 0.76rem; font-family: monospace;">$1</code>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  return (
    <>
      {/* Floating Launcher Button */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
        {!isOpen && (
          <button
            onClick={() => {
              soundFx.playClick();
              setIsOpen(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #1d4ed8 0%, #0f172a 100%)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              padding: '0.75rem 1.25rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              boxShadow: '0 10px 25px -5px rgba(29, 78, 216, 0.4), 0 0 15px rgba(56, 189, 248, 0.35)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'pulseGlow 3s infinite'
            }}
            title="Chat with Agent 47 AI Advisor"
          >
            <div style={{ position: 'relative' }}>
              <Bot size={22} style={{ color: '#38bdf8' }} />
              <span style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#4ade80',
                boxShadow: '0 0 6px #4ade80'
              }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.02em', lineHeight: 1.1 }}>
                Agent 47 AI Advisor
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', lineHeight: 1 }}>
                Due-Process & Policy
              </div>
            </div>
            <Sparkles size={16} style={{ color: '#fbbf24', marginLeft: '0.2rem' }} />
          </button>
        )}
      </div>

      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: '430px',
            maxWidth: 'calc(100vw - 32px)',
            height: '620px',
            maxHeight: 'calc(100vh - 48px)',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1001,
            overflow: 'hidden',
            animation: 'fadeInUp 0.2s ease-out'
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #07152b 0%, #0f172a 100%)',
            color: '#ffffff',
            padding: '0.9rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(56, 189, 248, 0.3)'
              }}>
                <AgentLogo size={28} showText={false} glowing={true} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800 }}>Agent 47 AI Advisor</span>
                  <span style={{
                    fontSize: '0.58rem',
                    background: 'rgba(74, 222, 128, 0.15)',
                    color: '#4ade80',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    padding: '0.05rem 0.35rem',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    Guilt-Neutral
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                  Student Discipline & Due Process Assistant
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setMessages([
                    {
                      id: 'welcome-reset',
                      sender: 'agent',
                      text: `Conversation cleared. How can I assist with university disciplinary policy or procedural due-process?`,
                      suggestions: [
                        'What are mandatory due-process requirements?',
                        'What is the sanction range for cheating?',
                        'Explain the Guilt-Neutrality Guardrail'
                      ],
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  borderRadius: '6px'
                }}
                title="Clear Chat History"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsOpen(false);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  borderRadius: '6px'
                }}
                title="Close Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Role Status Ribbon */}
          <div style={{
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '0.35rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            color: '#64748b'
          }}>
            <span>Active Persona: <strong style={{ color: '#0f172a' }}>{activeRole.toUpperCase()}</strong></span>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>● SHA-256 Ledger Active</span>
          </div>

          {/* Message Stream */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.9rem'
          }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '86%',
                    padding: '0.75rem 0.95rem',
                    borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    background: m.sender === 'user' ? '#1d4ed8' : '#ffffff',
                    color: m.sender === 'user' ? '#ffffff' : '#1e293b',
                    boxShadow: m.sender === 'user' ? '0 3px 10px rgba(29, 78, 216, 0.25)' : '0 1px 4px rgba(0, 0, 0, 0.05)',
                    border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0'
                  }}
                >
                  {m.sender === 'agent' ? (
                    renderFormattedText(m.text)
                  ) : (
                    <p style={{ margin: 0, fontSize: '0.84rem', lineHeight: 1.45 }}>{m.text}</p>
                  )}
                </div>

                <span style={{
                  fontSize: '0.62rem',
                  color: '#94a3b8',
                  marginTop: '0.2rem',
                  padding: '0 0.25rem'
                }}>
                  {m.timestamp}
                </span>

                {/* Suggestions Chips */}
                {m.sender === 'agent' && m.suggestions && m.suggestions.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.35rem',
                    marginTop: '0.45rem',
                    maxWidth: '95%'
                  }}>
                    {m.suggestions.map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => handleChipClick(chip)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '9999px',
                          padding: '0.25rem 0.6rem',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: '#2563eb',
                          cursor: 'pointer',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        ⚡ {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', width: 'fit-content' }}>
                <Bot size={14} style={{ color: '#2563eb' }} />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Agent 47 is searching policy ledger...</span>
                <span className="typing-dot" style={{ width: 4, height: 4, borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '0.75rem 1rem',
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about due process, sanctions, or cases..."
              style={{
                flex: 1,
                padding: '0.6rem 0.85rem',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                background: input.trim() ? '#1d4ed8' : '#94a3b8',
                color: '#ffffff',
                border: 'none',
                width: 36,
                height: 36,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'default',
                transition: 'background 0.2s ease'
              }}
              title="Send Message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

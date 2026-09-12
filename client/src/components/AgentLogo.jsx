import React from 'react';

export function AgentLogo({ size = 40, showText = true, glowing = false, subtitle = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
      <div style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {glowing && (
          <div style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.45) 0%, rgba(99, 102, 241, 0.2) 70%)',
            animation: 'pulseGlow 2.5s infinite ease-in-out',
            pointerEvents: 'none'
          }} />
        )}
        <img
          src="/agent_logo.png"
          alt="Agent 47 Shield Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: glowing ? 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.6))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            transition: 'transform 0.2s ease'
          }}
        />
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              fontSize: size > 40 ? '1.4rem' : '1.18rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: '#0a2540',
              letterSpacing: '-0.02em',
              lineHeight: 1.15
            }}>
              EduGuard
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              padding: '0.12rem 0.5rem',
              borderRadius: '9999px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Agent 47
            </span>
          </div>
          {subtitle && (
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
              Student Discipline & Due-Process Agent
            </span>
          )}
        </div>
      )}
    </div>
  );
}

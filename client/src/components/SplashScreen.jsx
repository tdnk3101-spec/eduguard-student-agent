import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/audioFx';

export function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isZoomingOut, setIsZoomingOut] = useState(false);

  const logs = [
    { text: '[SYS_BOOT] Initializing Agent 47 (Student Discipline & Due-Process Agent)...', pct: 15 },
    { text: '[INGRESS] Consuming Agent 44 Incident Ingress Pipeline (Date, Witnesses, Evidence)...', pct: 40 },
    { text: '[POLICY_ENGINE] Loading Offence Categories & Procedural Checklist Gates...', pct: 65 },
    { text: '[GUARDRAILS] Enforcing Guilt-Neutrality & Faculty/Placement Privacy Shield...', pct: 85 },
    { text: '[READY] Tamper-Evident SHA-256 Ledger Active. Feeds to Agents 56 & 57 Online.', pct: 100 }
  ];

  useEffect(() => {
    soundFx.playBoot();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleFinish();
          return 100;
        }
        return Math.min(100, prev + Math.floor(Math.random() * 8) + 5);
      });
    }, 110);

    const keyListener = (e) => {
      if (e.key === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', keyListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', keyListener);
    };
  }, []);

  useEffect(() => {
    if (progress < 25) setLogIndex(0);
    else if (progress < 50) setLogIndex(1);
    else if (progress < 75) setLogIndex(2);
    else if (progress < 95) setLogIndex(3);
    else setLogIndex(4);
  }, [progress]);

  function handleFinish() {
    setIsZoomingOut(true);
    soundFx.playClick();
    setTimeout(() => {
      onComplete();
    }, 650);
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'radial-gradient(circle at center, #07152b 0%, #040d1b 75%, #01060e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        overflow: 'hidden',
        transition: 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isZoomingOut ? 'scale(1.75)' : 'scale(1)',
        opacity: isZoomingOut ? 0 : 1,
        filter: isZoomingOut ? 'blur(16px)' : 'blur(0px)',
        pointerEvents: isZoomingOut ? 'none' : 'auto'
      }}
    >
      {/* Cyber Grid Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(37, 99, 235, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 99, 235, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.8,
          pointerEvents: 'none'
        }}
      />

      {/* Rotating Energy Rings */}
      <div
        style={{
          position: 'absolute',
          width: 380,
          height: 380,
          borderRadius: '50%',
          border: '1px dashed rgba(37, 99, 235, 0.3)',
          animation: 'spinSlow 22s linear infinite',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 290,
          height: 290,
          borderRadius: '50%',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          animation: 'spinReverse 15s linear infinite',
          pointerEvents: 'none'
        }}
      />

      {/* Glowing Crest Logo */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '2.5rem',
          transform: isZoomingOut ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 170,
            height: 170,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.5) 0%, rgba(99, 102, 241, 0.2) 60%, transparent 80%)',
            filter: 'blur(20px)',
            animation: 'pulseGlow 2.5s infinite ease-in-out',
            pointerEvents: 'none'
          }}
        />

        <img
          src="/agent_logo.png"
          alt="Agent 47 Crest Logo"
          style={{
            width: 115,
            height: 115,
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 25px rgba(37, 99, 235, 0.85))',
            position: 'relative',
            zIndex: 2
          }}
        />

        {/* Title */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(37, 99, 235, 0.2)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#38bdf8',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            <span>Agent 47 • Disciplinary Due Process</span>
          </div>

          <h1
            style={{
              fontSize: '2.6rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              color: '#ffffff',
              textShadow: '0 0 30px rgba(37, 99, 235, 0.6)'
            }}
          >
            Edu<span style={{ color: '#60a5fa' }}>Guard</span>
          </h1>
          <p
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#94a3b8',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: '0.35rem'
            }}
          >
            Autonomous Policy & Due-Process Management Agent
          </p>
        </div>
      </div>

      {/* Boot Progress Box */}
      <div
        style={{
          width: '90%',
          maxWidth: 500,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(37, 99, 235, 0.15)',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
            <span>AGENT_47_BOOT_SEQUENCE</span>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
            {progress}%
          </span>
        </div>

        {/* Progress Track */}
        <div
          style={{
            height: 6,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 9999,
            overflow: 'hidden',
            marginBottom: '0.85rem',
            position: 'relative'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
              boxShadow: '0 0 12px #38bdf8',
              borderRadius: 9999,
              transition: 'width 0.12s ease'
            }}
          />
        </div>

        {/* Terminal Line */}
        <div
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: '#cbd5e1',
            minHeight: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ color: '#38bdf8' }}>&gt;</span>
          <span>{logs[logIndex].text}</span>
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={handleFinish}
        style={{
          marginTop: '1.75rem',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#94a3b8',
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '0.4rem 1.1rem',
          borderRadius: '9999px',
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
          transition: 'all 0.2s ease',
          position: 'relative',
          zIndex: 2
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.color = '#ffffff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          e.currentTarget.style.color = '#94a3b8';
        }}
      >
        Skip Intro [ESC] &rarr;
      </button>

      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

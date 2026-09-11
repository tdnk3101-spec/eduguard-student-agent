import React from 'react';
import { VignanLogo } from './VignanLogo';

export function VignanBanner() {
  return (
    <div style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0.65rem 1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
    }}>
      {/* Left: Vignan's Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Official Vignan Shield Emblem */}
        <VignanLogo size={48} />

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{
              color: '#d32f2f',
              fontSize: '1.45rem',
              fontWeight: 900,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em',
              lineHeight: 1
            }}>
              VIGNAN'S
            </span>
            <span style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '0.1rem 0.35rem',
              borderRadius: '3px'
            }}>
              NAAC A+
            </span>
            <span style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '0.1rem 0.35rem',
              borderRadius: '3px'
            }}>
              NIRF 70th
            </span>
          </div>

          <div style={{
            fontSize: '0.62rem',
            fontWeight: 700,
            color: '#475569',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginTop: '0.15rem'
          }}>
            FOUNDATION FOR SCIENCE, TECHNOLOGY & RESEARCH
          </div>

          <div style={{
            fontSize: '0.58rem',
            color: '#1d4ed8',
            fontWeight: 600
          }}>
            (Deemed to be University) • Estd. u/s 3 of UGC Act 1956
          </div>
        </div>
      </div>

      {/* Center: CSE PRESENTS • AGENTIC AI DAY 2026 */}
      <div style={{ textAlign: 'center', padding: '0 1rem' }}>
        <div style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          color: '#64748b',
          textTransform: 'uppercase',
          marginBottom: '0.15rem'
        }}>
          CSE PRESENTS
        </div>
        <div style={{
          fontSize: '1.45rem',
          fontWeight: 900,
          letterSpacing: '0.04em',
          color: '#0a2540',
          fontFamily: 'var(--font-heading)',
          lineHeight: 1.1
        }}>
          AGENTIC AI DAY 2026
        </div>
      </div>

      {/* Right: Circular Official Accreditation Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* NAAC A+ */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '2px solid #b91c1c',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.55rem',
          fontWeight: 900,
          color: '#b91c1c',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }} title="NAAC Accredited A+">
          <span style={{ fontSize: '0.52rem', lineHeight: 1 }}>NAAC</span>
          <span style={{ color: '#dc2626', fontSize: '0.68rem', lineHeight: 1 }}>A+</span>
        </div>

        {/* nirf */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '2px solid #4338ca',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.65rem',
          fontWeight: 900,
          color: '#4338ca',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }} title="NIRF National Institutional Ranking">
          nirf
        </div>

        {/* NBA */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '2px solid #0284c7',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.62rem',
          fontWeight: 900,
          color: '#0284c7',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }} title="National Board of Accreditation">
          NBA
        </div>

        {/* ISO */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '2px solid #d97706',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.58rem',
          fontWeight: 800,
          color: '#d97706',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }} title="ISO Certified">
          ISO
        </div>

        {/* UGC */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '2px solid #7c3aed',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.55rem',
          fontWeight: 900,
          color: '#7c3aed',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }} title="UGC Recognized">
          UGC
        </div>

        {/* ABET */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '2px solid #ea580c',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.55rem',
          fontWeight: 900,
          color: '#ea580c',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }} title="ABET Accredited">
          ABET
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export function VignanBanner() {
  return (
    <div style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'relative',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)'
    }}>
      <div style={{
        padding: '0.4rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        maxWidth: '1600px',
        margin: '0 auto'
      }}>
        {/* Left: Official Institutional Logo matching Image 2 & reference */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img
            src="/vignan_official_logo.png"
            alt="Vignan's Foundation for Science, Technology & Research (Deemed to be University)"
            style={{
              height: '50px',
              maxWidth: '360px',
              objectFit: 'contain',
              flexShrink: 0
            }}
          />

          {/* NAAC A+ and NIRF 70th Badges */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.18rem',
            borderLeft: '1px solid #e2e8f0',
            paddingLeft: '0.5rem'
          }}>
            <div style={{
              border: '1px solid #fca5a5',
              borderRadius: '3px',
              padding: '0.1rem 0.35rem',
              textAlign: 'center',
              fontSize: '0.58rem',
              fontWeight: 800,
              color: '#b91c1c',
              background: '#fef2f2',
              lineHeight: 1.1,
              letterSpacing: '0.02em'
            }}>
              NAAC A+
            </div>
            <div style={{
              border: '1px solid #93c5fd',
              borderRadius: '3px',
              padding: '0.1rem 0.35rem',
              textAlign: 'center',
              fontSize: '0.58rem',
              fontWeight: 800,
              color: '#1d4ed8',
              background: '#eff6ff',
              lineHeight: 1.1,
              letterSpacing: '0.02em'
            }}>
              NIRF 70th
            </div>
          </div>
        </div>

        {/* Center: CSE PRESENTS • AGENTIC AI DAY 2026 */}
        <div style={{ textAlign: 'center', padding: '0 0.5rem' }}>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: '#475569',
            textTransform: 'uppercase',
            marginBottom: '0.1rem'
          }}>
            CSE PRESENTS
          </div>
          <div style={{
            fontSize: '1.48rem',
            fontWeight: 900,
            letterSpacing: '0.03em',
            color: '#0a2540',
            fontFamily: 'var(--font-heading)',
            lineHeight: 1.1
          }}>
            AGENTIC AI DAY 2026
          </div>
        </div>

        {/* Right: All 7 Circular Official Accreditation Badges matching the user reference */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {/* 1. NAAC A+ */}
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: '2px solid #b91c1c',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }} title="NAAC Accredited A+">
            <span style={{ fontSize: '0.46rem', fontWeight: 800, color: '#b91c1c', lineHeight: 1 }}>NAAC</span>
            <span style={{ fontSize: '0.66rem', fontWeight: 900, color: '#dc2626', lineHeight: 1 }}>A+</span>
          </div>

          {/* 2. nirf */}
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: '2px solid #1e3a8a',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }} title="NIRF National Institutional Ranking #70">
            <span style={{ fontSize: '0.64rem', fontWeight: 900, color: '#1e3a8a', lineHeight: 1 }}>nirf</span>
            <span style={{ fontSize: '0.42rem', fontWeight: 700, color: '#64748b', lineHeight: 1 }}>70th</span>
          </div>

          {/* 3. NBA */}
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: '2px solid #0284c7',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }} title="National Board of Accreditation">
            <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#0284c7', lineHeight: 1 }}>NBA</span>
            <span style={{ fontSize: '0.38rem', fontWeight: 700, color: '#0284c7', lineHeight: 1 }}>ACCREDITED</span>
          </div>

          {/* 4. Golden Emblem / QS / Diamond */}
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: '2px solid #d97706',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }} title="QS I-GAUGE Diamond / ISO Excellence">
            <span style={{ fontSize: '0.68rem', lineHeight: 1 }}>🦁</span>
            <span style={{ fontSize: '0.38rem', fontWeight: 800, color: '#d97706', lineHeight: 1 }}>QS</span>
          </div>

          {/* 5. UGC DEB */}
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: '2px solid #7c3aed',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }} title="UGC Distance Education Bureau Recognized">
            <span style={{ fontSize: '0.52rem', fontWeight: 900, color: '#7c3aed', lineHeight: 1 }}>UGC</span>
            <span style={{ fontSize: '0.4rem', fontWeight: 700, color: '#7c3aed', lineHeight: 1 }}>DEB</span>
          </div>

          {/* 6. AICTE / NBA */}
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: '2px solid #db2777',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }} title="AICTE Approved">
            <span style={{ fontSize: '0.62rem', lineHeight: 1 }}>🏛️</span>
            <span style={{ fontSize: '0.38rem', fontWeight: 800, color: '#db2777', lineHeight: 1 }}>AICTE</span>
          </div>

          {/* 7. ABET */}
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: '2px solid #ea580c',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }} title="ABET Accredited International Standards">
            <span style={{ fontSize: '0.58rem', fontWeight: 900, color: '#ea580c', lineHeight: 1 }}>ABET</span>
            <span style={{ fontSize: '0.38rem', fontWeight: 700, color: '#ea580c', lineHeight: 1 }}>GLOBAL</span>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Accent Gradient Line */}
      <div style={{
        height: '2px',
        width: '100%',
        background: 'linear-gradient(90deg, #1d4ed8 0%, #38bdf8 50%, #1d4ed8 100%)',
        opacity: 0.85
      }} />
    </div>
  );
}

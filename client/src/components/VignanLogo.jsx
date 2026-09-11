import React from 'react';

export function VignanLogo({ size = 44, className = '', style = {} }) {
  // 5 spokes angles with 1 spoke pointing straight down (90 deg)
  const spokeAngles = [90, 162, 234, 306, 18];
  const cx = 60;
  const cy = 58;
  const r = 35;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', flexShrink: 0, ...style }}
    >
      <defs>
        {/* Shield Clip */}
        <clipPath id="shieldClip">
          <path d="M 12 14 C 40 26, 80 26, 108 14 C 111 60, 96 96, 60 114 C 24 96, 9 60, 12 14 Z" />
        </clipPath>
        {/* Circle Clip */}
        <clipPath id="circleClip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* Outer Shield Outline */}
      <path
        d="M 12 14 C 40 26, 80 26, 108 14 C 111 60, 96 96, 60 114 C 24 96, 9 60, 12 14 Z"
        fill="#ffffff"
        stroke="#4f46e5"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Inner lavender/purple background circle */}
      <circle cx={cx} cy={cy} r={r} fill="#9bb3f8" />

      {/* 5 White and Blue Radial Spokes */}
      <g clipPath="url(#circleClip)">
        {spokeAngles.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x2 = cx + Math.cos(rad) * (r + 4);
          const y2 = cy + Math.sin(rad) * (r + 4);

          return (
            <g key={i}>
              {/* White background spoke border */}
              <line
                x1={cx}
                y1={cy}
                x2={x2}
                y2={y2}
                stroke="#ffffff"
                strokeWidth="15"
                strokeLinecap="butt"
              />
              {/* Blue inner spoke */}
              <line
                x1={cx}
                y1={cy}
                x2={x2}
                y2={y2}
                stroke="#0080ff"
                strokeWidth="8"
                strokeLinecap="butt"
              />
            </g>
          );
        })}
      </g>

      {/* Circle Outline */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ffffff" strokeWidth="2.5" />

      {/* Center White Hub */}
      <circle cx={cx} cy={cy} r={12.5} fill="#ffffff" stroke="#0080ff" strokeWidth="2" />

      {/* 5-Pointed Blue Star in Center (pointing straight UP) */}
      {/* Center (cx, cy), outer radius ~7.5, inner radius ~3.5 */}
      <polygon
        points="
          60,51
          62.3,55.8
          67.5,56.5
          63.8,60.1
          64.7,65.3
          60,62.8
          55.3,65.3
          56.2,60.1
          52.5,56.5
          57.7,55.8
        "
        fill="#0080ff"
      />
    </svg>
  );
}

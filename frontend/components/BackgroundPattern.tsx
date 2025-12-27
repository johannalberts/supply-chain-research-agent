"use client";

import { useSettings } from '@/lib/settings-context';
import { CSSProperties, useEffect } from 'react';

const svgHexPattern = encodeURIComponent(`
<svg width="28" height="49" viewBox="0 0 28 49" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5z" 
        stroke="#14b8a6" fill="none" stroke-width="1" opacity="0.2"/>
</svg>`);

const circuitPattern = encodeURIComponent(`
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" stroke="#14b8a6" stroke-width="1" opacity="0.15">
    <path d="M0 20 H30 V50 H100" />
    <path d="M20 0 V10 H50 V30 H60 V100" />
    <path d="M80 100 V70 H40 V60" />
    <path d="M100 10 H80 V40 H100" />
    
    <circle cx="30" cy="50" r="2" fill="#14b8a6" />
    <circle cx="50" cy="30" r="2" fill="#14b8a6" />
    <circle cx="80" cy="70" r="2" fill="#14b8a6" />
    <circle cx="80" cy="40" r="2" fill="#14b8a6" />
  </g>
</svg>`);

export default function BackgroundPattern() {
  const { backgroundPattern } = useSettings();

  useEffect(() => {
  }, [backgroundPattern]);

  if (backgroundPattern === 'none') {
    return null;
  }

  const getPatternStyle = (): CSSProperties => {
    switch (backgroundPattern) {
      case 'grid':
        return {
          backgroundImage: `
            linear-gradient(rgba(20, 184, 166, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        };

      case 'hexagon':
        return {
            backgroundImage: `url("data:image/svg+xml,${svgHexPattern}")`,
            backgroundSize: '56px 98px'
        };

      case 'circuit':
        return {
            backgroundImage: `url("data:image/svg+xml,${circuitPattern}")`,
            backgroundSize: '200px 200px', // Scale this up or down for density
        };
      
      case 'dots':
        return {
          backgroundImage: `
            radial-gradient(circle, rgba(20, 184, 166, 0.1) 1.5px, transparent 1.5px),
            radial-gradient(circle, rgba(168, 85, 247, 0.08) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
        };

      default:
        return {};
    }
  };

  const patternStyle = getPatternStyle();

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        backgroundColor: '#000000',
        ...patternStyle,
      }}
    />
  );
}



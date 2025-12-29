"use client";

import { useSettings } from '@/lib/settings-context';
import { useState, useRef, useEffect } from 'react';

type BackgroundPattern = 'none' | 'grid' | 'hexagon' | 'circuit' | 'dots';

export default function BackgroundPatternSelector() {
  const { backgroundPattern, setBackgroundPattern } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const patterns: Array<{ value: BackgroundPattern; label: string; description: string }> = [
    { value: 'none', label: 'NONE', description: 'Solid background' },
    { value: 'grid', label: 'GRID', description: 'Technical grid pattern' },
    { value: 'hexagon', label: 'HEXAGON', description: 'Honeycomb structure' },
    { value: 'circuit', label: 'CIRCUIT', description: 'Circuit board lines' },
    { value: 'dots', label: 'DOTS', description: 'Dot matrix pattern' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentPattern = patterns.find(p => p.value === backgroundPattern);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 sci-button flex items-center gap-2"
        style={{
          background: 'var(--primary-teal)',
          color: 'var(--text-dark)',
          minWidth: '180px',
        }}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
        </svg>
        <span className="flex-1 text-left">{currentPattern?.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full mt-2 right-0 rounded-2xl overflow-hidden z-50"
          style={{
            background: 'linear-gradient(135deg, var(--bg-panel-gradient-start) 0%, var(--bg-panel-gradient-end) 100%)',
            border: '2px solid var(--border-teal)',
            minWidth: '280px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div className="p-2">
            <div
              className="px-3 py-2 text-xs font-bold mb-2"
              style={{
                color: 'var(--text-secondary)',
                fontFamily: 'Antonio, sans-serif',
                letterSpacing: '0.15em',
              }}
            >
              BACKGROUND PATTERN
            </div>
            {patterns.map((pattern) => (
              <button
                key={pattern.value}
                onClick={() => {
                  setBackgroundPattern(pattern.value);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl transition-all"
                style={{
                  background: backgroundPattern === pattern.value
                    ? 'linear-gradient(90deg, var(--primary-teal) 0%, var(--primary-cyan) 100%)'
                    : 'transparent',
                  color: backgroundPattern === pattern.value ? 'var(--text-dark)' : 'var(--text-primary)',
                  border: backgroundPattern === pattern.value ? 'none' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (backgroundPattern !== pattern.value) {
                    e.currentTarget.style.border = '1px solid var(--border-teal)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (backgroundPattern !== pattern.value) {
                    e.currentTarget.style.border = '1px solid transparent';
                  }
                }}
              >
                <div className="font-bold sci-heading text-sm mb-1">
                  {pattern.label}
                </div>
                <div
                  className="text-xs sci-text"
                  style={{
                    color: backgroundPattern === pattern.value ? 'var(--text-dark)' : 'var(--text-secondary)',
                    opacity: 0.8,
                  }}
                >
                  {pattern.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

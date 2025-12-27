"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type BackgroundPattern = 'none' | 'grid' | 'hexagon' | 'circuit' | 'dots';

interface SettingsContextType {
  backgroundPattern: BackgroundPattern;
  setBackgroundPattern: (pattern: BackgroundPattern) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [backgroundPattern, setBackgroundPattern] = useState<BackgroundPattern>('none');

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !('localStorage' in window)) {
      return;
    }
    try {
      const saved = window.localStorage.getItem('backgroundPattern') as BackgroundPattern;
      if (saved) {
        setBackgroundPattern(saved);
      }
    } catch (error) {
    }
  }, []);
  // Save to localStorage when changed
  const handleSetPattern = (pattern: BackgroundPattern) => {
    setBackgroundPattern(pattern);
    if (typeof window === 'undefined' || !('localStorage' in window)) {
      return;
    }
    try {
      window.localStorage.setItem('backgroundPattern', pattern);
    } catch (error) {
      console.error('🎨 Settings context: Error accessing localStorage while saving pattern', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ backgroundPattern, setBackgroundPattern: handleSetPattern }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

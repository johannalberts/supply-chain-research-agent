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
    console.log('🎨 Settings context: Mounting, checking localStorage');
    const saved = localStorage.getItem('backgroundPattern') as BackgroundPattern;
    console.log('🎨 Settings context: Saved pattern from localStorage:', saved);
    if (saved) {
      setBackgroundPattern(saved);
    }
  }, []);

  // Save to localStorage when changed
  const handleSetPattern = (pattern: BackgroundPattern) => {
    console.log('🎨 Settings context: Setting pattern to', pattern);
    setBackgroundPattern(pattern);
    localStorage.setItem('backgroundPattern', pattern);
    console.log('🎨 Settings context: Pattern set and saved to localStorage');
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

"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { AppSettings } from '@/lib/types';

interface SettingsContextType {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  isReady: boolean;
}

const defaultSettings: AppSettings = {
  unit: 'miles',
  currency: 'USD',
  deductionRate: 0.67,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings, isReady] = useLocalStorage<AppSettings>('settings', defaultSettings);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, isReady }}>
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

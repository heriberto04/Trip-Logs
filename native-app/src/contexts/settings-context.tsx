import React, { createContext, useContext, ReactNode } from 'react';
import { useAsyncStorage } from '../lib/storage';
import type { AppSettings } from '../lib/types';

interface SettingsContextType {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  importSettings: (settings: AppSettings) => void;
  isReady: boolean;
}

const defaultSettings: AppSettings = {
  unit: 'miles',
  currency: 'USD',
  deductionRate: 0.67,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings, isLoading] = useAsyncStorage<AppSettings>('settings', defaultSettings);

  const importSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      setSettings, 
      importSettings, 
      isReady: !isLoading 
    }}>
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
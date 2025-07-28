
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { OdometerReading } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface OdometerContextType {
  odometerReadings: OdometerReading[];
  addOdometerReading: (reading: Omit<OdometerReading, 'id'>) => void;
  isReady: boolean;
}

const OdometerContext = createContext<OdometerContextType | undefined>(undefined);

export function OdometerProvider({ children }: { children: ReactNode }) {
  const [odometerReadings, setOdometerReadings, isReady] = useLocalStorage<OdometerReading[]>('odometerReadings', []);

  const addOdometerReading = (reading: Omit<OdometerReading, 'id'>) => {
    const newReading: OdometerReading = {
        ...reading,
        id: uuidv4()
    };
    setOdometerReadings(prev => [newReading, ...prev]);
  };

  return (
    <OdometerContext.Provider value={{ odometerReadings, addOdometerReading, isReady }}>
      {children}
    </OdometerContext.Provider>
  );
}

export function useOdometer() {
  const context = useContext(OdometerContext);
  if (context === undefined) {
    throw new Error('useOdometer must be used within a OdometerProvider');
  }
  return context;
}

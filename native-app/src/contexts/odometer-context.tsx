import React, { createContext, useContext, ReactNode } from 'react';
import { useAsyncStorage } from '../lib/storage';
import type { OdometerReading } from '../lib/types';
import { v4 as uuidv4 } from 'uuid';

interface OdometerContextType {
  odometerReadings: OdometerReading[];
  addOdometerReading: (reading: Omit<OdometerReading, 'id'>) => void;
  importOdometerReadings: (readings: OdometerReading[]) => void;
  isReady: boolean;
}

const OdometerContext = createContext<OdometerContextType | undefined>(undefined);

export function OdometerProvider({ children }: { children: ReactNode }) {
  const [odometerReadings, setOdometerReadings, isLoading] = useAsyncStorage<OdometerReading[]>('odometerReadings', []);

  const addOdometerReading = (reading: Omit<OdometerReading, 'id'>) => {
    const newReading: OdometerReading = {
        ...reading,
        id: uuidv4()
    };
    setOdometerReadings(prev => [newReading, ...prev]);
  };
  
  const importOdometerReadings = (readings: OdometerReading[]) => {
    setOdometerReadings(readings);
  };

  return (
    <OdometerContext.Provider value={{ 
      odometerReadings, 
      addOdometerReading, 
      importOdometerReadings, 
      isReady: !isLoading 
    }}>
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
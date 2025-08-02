
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Vehicle } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useTrips } from './trips-context';

interface VehiclesContextType {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicleOdometer: (id: string, odometer: number) => void;
  deleteVehicle: (id: string) => void;
  getVehicleById: (id: string) => Vehicle | undefined;
  importVehicles: (vehicles: Vehicle[]) => void;
  isReady: boolean;
}

const VehiclesContext = createContext<VehiclesContextType | undefined>(undefined);

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles, isReady] = useLocalStorage<Vehicle[]>('vehicles', []);
  const { deleteTripsByVehicleId } = useTrips();

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle = { ...vehicle, id: uuidv4(), odometer: vehicle.odometer || null };
    setVehicles(prev => [...prev, newVehicle]);
  };

  const updateVehicleOdometer = (id: string, odometer: number) => {
    setVehicles(prev => prev.map(v => (v.id === id ? { ...v, odometer } : v)));
  };

  const deleteVehicle = (id: string) => {
    deleteTripsByVehicleId(id);
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const getVehicleById = (id: string) => {
    return vehicles.find(v => v.id === id);
  }
  
  const importVehicles = (newVehicles: Vehicle[]) => {
    setVehicles(newVehicles);
  };

  return (
    <VehiclesContext.Provider value={{ vehicles, addVehicle, updateVehicleOdometer, deleteVehicle, getVehicleById, importVehicles, isReady }}>
      {children}
    </VehiclesContext.Provider>
  );
}

export function useVehicles() {
  const context = useContext(VehiclesContext);
  if (context === undefined) {
    throw new Error('useVehicles must be used within a VehiclesProvider');
  }
  return context;
}

    
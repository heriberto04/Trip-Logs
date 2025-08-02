
"use client";

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Trip } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface TripsContextType {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  getTripsByYear: (year: number) => Trip[];
  deleteTripsByVehicleId: (vehicleId: string) => void;
  importTrips: (trips: Trip[]) => void;
  isReady: boolean;
}

const TripsContext = createContext<TripsContextType | undefined>(undefined);

export function TripsProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips, isReady] = useLocalStorage<Trip[]>('trips', []);

  const addTrip = useCallback((trip: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...trip,
      id: uuidv4(),
      odometerStart: trip.odometerStart ?? null,
      odometerEnd: trip.odometerEnd ?? null,
    };
    
    setTrips(prevTrips => [newTrip, ...prevTrips]);
  }, [setTrips]);

  const updateTrip = useCallback((updatedTrip: Trip) => {
    setTrips(prevTrips =>
      prevTrips.map(trip => (trip.id === updatedTrip.id ? updatedTrip : trip))
    );
  }, [setTrips]);

  const deleteTrip = useCallback((id: string) => {
    setTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
  }, [setTrips]);
  
  const deleteTripsByVehicleId = useCallback((vehicleId: string) => {
    setTrips(prevTrips => prevTrips.filter(trip => trip.vehicleId !== vehicleId));
  },[setTrips]);

  const getTripsByYear = useCallback((year: number) => {
    return trips.filter(trip => new Date(trip.date).getFullYear() === year);
  }, [trips]);

  const importTrips = (newTrips: Trip[]) => {
    setTrips(newTrips);
  };

  return (
    <TripsContext.Provider value={{ trips, addTrip, updateTrip, deleteTrip, getTripsByYear, deleteTripsByVehicleId, importTrips, isReady }}>
      {children}
    </TripsContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripsContext);
  if (context === undefined) {
    throw new Error('useTrips must be used within a TripsProvider');
  }
  return context;
}

    
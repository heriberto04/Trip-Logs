// src/contexts/trips-context.tsx
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Trip } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface TripsContextType {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  getTripsByYear: (year: number) => Trip[];
}

const TripsContext = createContext<TripsContextType | undefined>(undefined);

export function TripsProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useLocalStorage<Trip[]>('trips', []);

  const addTrip = (trip: Omit<Trip, 'id'>) => {
    const newTrip = { ...trip, id: uuidv4() };
    setTrips(prevTrips => [newTrip, ...prevTrips]);
  };

  const updateTrip = (updatedTrip: Trip) => {
    setTrips(prevTrips =>
      prevTrips.map(trip => (trip.id === updatedTrip.id ? updatedTrip : trip))
    );
  };

  const deleteTrip = (id: string) => {
    setTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
  };

  const getTripsByYear = (year: number) => {
    return trips.filter(trip => new Date(trip.date).getFullYear() === year);
  };

  return (
    <TripsContext.Provider value={{ trips, addTrip, updateTrip, deleteTrip, getTripsByYear }}>
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

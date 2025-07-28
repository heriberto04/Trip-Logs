
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Trip } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useVehicles } from './vehicles-context';

interface TripsContextType {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  getTripsByYear: (year: number) => Trip[];
  isReady: boolean;
}

const TripsContext = createContext<TripsContextType | undefined>(undefined);

export function TripsProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips, isReady] = useLocalStorage<Trip[]>('trips', []);
  const { vehicles, updateVehicleOdometer, getVehicleById } = useVehicles();

  const addTrip = (trip: Omit<Trip, 'id'>) => {
    let odometerStart: number | null = null;
    let odometerEnd: number | null = null;

    if (trip.vehicleId) {
        const vehicle = getVehicleById(trip.vehicleId);
        if (vehicle && vehicle.odometer) {
            const lastTripWithVehicle = trips
                .filter(t => t.vehicleId === trip.vehicleId && t.odometerEnd)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

            odometerStart = lastTripWithVehicle ? lastTripWithVehicle.odometerEnd : vehicle.odometer;
            
            if (trip.miles > 0 && odometerStart !== null) {
                odometerEnd = odometerStart + trip.miles;
                updateVehicleOdometer(trip.vehicleId, odometerEnd);
            }
        }
    }
    
    const newTrip: Trip = {
      ...trip,
      id: uuidv4(),
      odometerStart: trip.odometerStart ?? odometerStart,
      odometerEnd: trip.odometerEnd ?? odometerEnd,
    };
    
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
    <TripsContext.Provider value={{ trips, addTrip, updateTrip, deleteTrip, getTripsByYear, isReady }}>
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

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip } from '../types';

interface TripsContextType {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id'>) => Promise<void>;
  updateTrip: (id: string, trip: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  loading: boolean;
}

const TripsContext = createContext<TripsContextType | undefined>(undefined);

export const useTrips = () => {
  const context = useContext(TripsContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripsProvider');
  }
  return context;
};

interface TripsProviderProps {
  children: ReactNode;
}

export const TripsProvider: React.FC<TripsProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTrips = useCallback(async () => {
    try {
      const storedTrips = await AsyncStorage.getItem('trips');
      if (storedTrips) {
        setTrips(JSON.parse(storedTrips));
      } else {
        // Initialize with sample data if no trips exist
        const { generateSampleTrips } = await import('../utils/helpers');
        const sampleTrips = generateSampleTrips();
        await saveTrips(sampleTrips);
      }
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const saveTrips = async (newTrips: Trip[]) => {
    try {
      await AsyncStorage.setItem('trips', JSON.stringify(newTrips));
      setTrips(newTrips);
    } catch (error) {
      console.error('Error saving trips:', error);
    }
  };

  const addTrip = async (tripData: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: Date.now().toString(),
    };
    const newTrips = [...trips, newTrip];
    await saveTrips(newTrips);
  };

  const updateTrip = async (id: string, tripData: Partial<Trip>) => {
    const newTrips = trips.map(trip => 
      trip.id === id ? { ...trip, ...tripData } : trip
    );
    await saveTrips(newTrips);
  };

  const deleteTrip = async (id: string) => {
    const newTrips = trips.filter(trip => trip.id !== id);
    await saveTrips(newTrips);
  };

  return (
    <TripsContext.Provider value={{
      trips,
      addTrip,
      updateTrip,
      deleteTrip,
      loading,
    }}>
      {children}
    </TripsContext.Provider>
  );
};
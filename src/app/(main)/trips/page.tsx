"use client";

import React, { useState, useMemo } from 'react';
import { useTrips } from '@/contexts/trips-context';
import { TripCard } from '@/components/trip-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddTripSheet } from '@/components/add-trip-sheet';
import type { Trip } from '@/lib/types';
import Image from 'next/image';

export default function TripsPage() {
  const { trips } = useTrips();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const currentYear = new Date().getFullYear();
  const currentYearTrips = useMemo(() => {
    return trips
      .filter(trip => new Date(trip.date).getFullYear() === currentYear)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [trips, currentYear]);

  const handleAddTrip = () => {
    setEditingTrip(null);
    setIsSheetOpen(true);
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setIsSheetOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center font-headline">My Trips</h1>
      
      {currentYearTrips.length === 0 ? (
        <div className="text-center mt-20 flex flex-col items-center">
            <Image src="https://placehold.co/300x200.png" alt="No trips yet" width={300} height={200} className="rounded-lg mb-4 opacity-50" data-ai-hint="road trip empty" />
            <p className="text-muted-foreground">No trips logged for {currentYear}.</p>
            <p className="text-muted-foreground">Tap the plus button to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentYearTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} onEdit={() => handleEditTrip(trip)} />
          ))}
        </div>
      )}

      <Button
        onClick={handleAddTrip}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full shadow-lg"
        aria-label="Add new trip"
      >
        <Plus className="w-8 h-8" />
      </Button>

      <AddTripSheet
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        trip={editingTrip}
      />
    </div>
  );
}

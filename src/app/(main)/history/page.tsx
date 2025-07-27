"use client";

import React, { useMemo } from 'react';
import { useTrips } from '@/contexts/trips-context';
import { TripCard } from '@/components/trip-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Trip } from '@/lib/types';
import { AddTripSheet } from '@/components/add-trip-sheet';
import Image from 'next/image';

export default function HistoryPage() {
  const { trips } = useTrips();
  const [editingTrip, setEditingTrip] = React.useState<Trip | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const tripsByYear = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const grouped: { [year: number]: Trip[] } = {};

    trips
      .filter(trip => new Date(trip.date).getFullYear() < currentYear)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach(trip => {
        const year = new Date(trip.date).getFullYear();
        if (!grouped[year]) {
          grouped[year] = [];
        }
        grouped[year].push(trip);
      });

    return Object.entries(grouped).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA));
  }, [trips]);
  
  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setIsSheetOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center font-headline">History</h1>
      
      {tripsByYear.length === 0 ? (
        <div className="text-center mt-20 flex flex-col items-center">
             <Image src="https://placehold.co/300x200.png" alt="No history" width={300} height={200} className="rounded-lg mb-4 opacity-50" data-ai-hint="archive box empty" />
            <p className="text-muted-foreground">No trips from previous years found.</p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {tripsByYear.map(([year, yearTrips]) => (
            <AccordionItem value={year} key={year}>
              <AccordionTrigger className="text-xl font-semibold">{year}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-1">
                  {yearTrips.map(trip => (
                    <TripCard key={trip.id} trip={trip} onEdit={() => handleEditTrip(trip)} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <AddTripSheet
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        trip={editingTrip}
      />
    </div>
  );
}


"use client";

import React, { useMemo, useState, useCallback } from 'react';
import { useTrips } from '@/contexts/trips-context';
import { TripCard } from '@/components/trip-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Trip } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';

const AddTripSheet = dynamic(() => import('@/components/add-trip-sheet').then(mod => mod.AddTripSheet));
const ViewTripDialog = dynamic(() => import('@/components/view-trip-dialog').then(mod => mod.ViewTripDialog));


export default function HistoryPage() {
  const { trips, deleteTrip } = useTrips();
  const { toast } = useToast();
  const [editingTrip, setEditingTrip] = React.useState<Trip | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingTrip, setViewingTrip] = useState<Trip | null>(null);

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
  
  const handleEditTrip = useCallback((trip: Trip) => {
    setEditingTrip(trip);
    setIsSheetOpen(true);
    setIsViewDialogOpen(false);
  }, []);
  
  const handleViewTrip = useCallback((trip: Trip) => {
    setViewingTrip(trip);
    setIsViewDialogOpen(true);
  }, []);

  const handleDeleteTrip = useCallback((id: string) => {
    deleteTrip(id);
    setIsViewDialogOpen(false);
    toast({
        title: "Trip Deleted",
        description: "The trip has been permanently removed.",
    });
  }, [deleteTrip, toast]);

  return (
    <div className="container mx-auto p-4">
      
      {tripsByYear.length === 0 ? (
        <div className="text-center mt-20 flex flex-col items-center">
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
                    <TripCard 
                      key={trip.id} 
                      trip={trip} 
                      onView={() => handleViewTrip(trip)}
                      onEdit={() => handleEditTrip(trip)} 
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {isSheetOpen && (
        <AddTripSheet
            isOpen={isSheetOpen}
            setIsOpen={setIsSheetOpen}
            trip={editingTrip}
        />
      )}
      
      {isViewDialogOpen && (
         <ViewTripDialog
            isOpen={isViewDialogOpen}
            setIsOpen={setIsViewDialogOpen}
            trip={viewingTrip}
            onEdit={handleEditTrip}
            onDelete={handleDeleteTrip}
        />
      )}
    </div>
  );
}

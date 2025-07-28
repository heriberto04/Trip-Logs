
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { useTrips } from '@/contexts/trips-context';
import { TripCard } from '@/components/trip-card';
import { Button } from '@/components/ui/button';
import { Plus, Gauge } from 'lucide-react';
import { AddTripSheet } from '@/components/add-trip-sheet';
import type { Trip, OdometerReading } from '@/lib/types';
import { ViewTripDialog } from '@/components/view-trip-dialog';
import { UpdateOdometerDialog } from '@/components/update-odometer-dialog';
import { useToast } from '@/hooks/use-toast';
import { useOdometer } from '@/contexts/odometer-context';
import { OdometerCard } from '@/components/odometer-card';

typeTimelineItem = (Trip & { type: 'trip' }) | (OdometerReading & { type: 'odometer' });

export default function TripsPage() {
  const { trips, deleteTrip } = useTrips();
  const { odometerReadings } = useOdometer();
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingTrip, setViewingTrip] = useState<Trip | null>(null);
  
  const [isOdometerDialogOpen, setIsOdometerDialogOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  
  const timelineItems = useMemo(() => {
    const currentYearTrips = trips
      .filter(trip => new Date(trip.date).getFullYear() === currentYear)
      .map(trip => ({ ...trip, type: 'trip' as const }));

    const currentYearOdometerReadings = odometerReadings
      .filter(reading => new Date(reading.date).getFullYear() === currentYear)
      .map(reading => ({ ...reading, type: 'odometer' as const }));

    const combined = [...currentYearTrips, ...currentYearOdometerReadings];
    
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  }, [trips, odometerReadings, currentYear]);


  const handleAddTrip = useCallback(() => {
    setEditingTrip(null);
    setIsSheetOpen(true);
  }, []);

  const handleEditTrip = useCallback((trip: Trip) => {
    setEditingTrip(trip);
    setIsSheetOpen(true);
    setIsViewDialogOpen(false); // Close view dialog if open
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
  
  const handleOdometerClick = useCallback(() => {
    setIsOdometerDialogOpen(true);
  }, []);

  return (
    <div className="container mx-auto p-4">
      
      {timelineItems.length === 0 ? (
        <div className="text-center mt-20 flex flex-col items-center">
            <p className="text-muted-foreground">No trips logged for {currentYear}.</p>
            <p className="text-muted-foreground">Tap the plus button to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {timelineItems.map(item => {
            if(item.type === 'trip') {
              return (
                <TripCard 
                  key={item.id} 
                  trip={item} 
                  onView={() => handleViewTrip(item)}
                  onEdit={() => handleEditTrip(item)} 
                />
              )
            }
            if(item.type === 'odometer') {
              return (
                <OdometerCard key={item.id} reading={item} />
              )
            }
            return null;
          })}
        </div>
      )}
      
      <Button
        onClick={handleOdometerClick}
        className="fixed bottom-24 left-6 w-16 h-16 rounded-full shadow-lg p-0 flex items-center justify-center"
        aria-label="Odometer"
      >
        <Gauge className="w-8 h-8" />
      </Button>

      <Button
        onClick={handleAddTrip}
        className="fixed bottom-24 right-6 w-16 h-16 rounded-full shadow-lg p-0 flex items-center justify-center"
        aria-label="Add new trip"
      >
        <Plus className="w-8 h-8" />
      </Button>

      <AddTripSheet
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        trip={editingTrip}
      />
      
       <ViewTripDialog
        isOpen={isViewDialogOpen}
        setIsOpen={setIsViewDialogOpen}
        trip={viewingTrip}
        onEdit={handleEditTrip}
        onDelete={handleDeleteTrip}
      />

      <UpdateOdometerDialog
        isOpen={isOdometerDialogOpen}
        setIsOpen={setIsOdometerDialogOpen}
      />
    </div>
  );
}

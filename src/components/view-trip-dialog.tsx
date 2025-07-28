
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/contexts/settings-context';
import { useVehicles } from '@/contexts/vehicles-context';
import type { Trip } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { calculateDuration, formatCurrency } from '@/lib/utils';
import { Edit, Trash2, Gauge } from 'lucide-react';

interface ViewTripDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  trip: Trip | null;
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
}

export function ViewTripDialog({ isOpen, setIsOpen, trip, onEdit, onDelete }: ViewTripDialogProps) {
  const { settings } = useSettings();
  const { getVehicleById } = useVehicles();

  if (!trip) return null;

  const vehicle = trip.vehicleId ? getVehicleById(trip.vehicleId) : null;
  const durationMinutes = calculateDuration(trip.startTime, trip.endTime);
  const durationFormatted = `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
  const totalExpenses = trip.expenses.gasoline + trip.expenses.tolls + trip.expenses.food;
  const deductions = trip.miles * settings.deductionRate;
  const net = trip.grossEarnings - totalExpenses;
  const formattedDate = format(parseISO(trip.date), 'EEEE, MMMM d, yyyy');


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formattedDate}</DialogTitle>
          <DialogDescription>
            {trip.startTime} - {trip.endTime} ({durationFormatted})
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-semibold text-muted-foreground">Gross Earnings</div>
                <div className="text-right font-semibold text-green-500">{formatCurrency(trip.grossEarnings, settings.currency)}</div>

                <div className="font-semibold text-muted-foreground">Total Expenses</div>
                <div className="text-right font-semibold text-red-500">{formatCurrency(totalExpenses, settings.currency)}</div>
                
                <div className="pl-4 text-muted-foreground">Gasoline</div>
                <div className="text-right">{formatCurrency(trip.expenses.gasoline, settings.currency)}</div>
                <div className="pl-4 text-muted-foreground">Tolls</div>
                <div className="text-right">{formatCurrency(trip.expenses.tolls, settings.currency)}</div>
                <div className="pl-4 text-muted-foreground">Food</div>
                <div className="text-right">{formatCurrency(trip.expenses.food, settings.currency)}</div>
            </div>
            
            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
                 <div className="font-semibold text-muted-foreground">Net Earnings</div>
                <div className="text-right font-bold">{formatCurrency(net, settings.currency)}</div>
            </div>

            <Separator />

             <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-semibold text-muted-foreground">Distance</div>
                <div className="text-right">{trip.miles.toFixed(1)} {settings.unit}</div>
                
                {trip.odometerStart !== null && trip.odometerEnd !== null && (
                     <div className="col-span-2 flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Gauge className="w-3 h-3"/>
                            <span>Odometer</span>
                        </div>
                        <span>{trip.odometerStart.toLocaleString()} - {trip.odometerEnd.toLocaleString()}</span>
                     </div>
                )}


                <div className="font-semibold text-muted-foreground">Tax Deduction</div>
                <div className="text-right">{formatCurrency(deductions, settings.currency)}</div>
            </div>

            <Separator />
            
             <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-semibold text-muted-foreground">Vehicle</div>
                <div className="text-right">{vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'N/A'}</div>
             </div>
        </div>

        <DialogFooter className="mt-4 sm:justify-end w-full">
            <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

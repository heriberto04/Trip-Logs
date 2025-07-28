
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Gauge } from 'lucide-react';
import { useTrips } from '@/contexts/trips-context';
import { useSettings } from '@/contexts/settings-context';
import { calculateDuration, formatCurrency, cn } from '@/lib/utils';
import type { Trip } from '@/lib/types';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from '@/components/ui/separator';


interface TripCardProps {
  trip: Trip;
  onView: () => void;
  onEdit: () => void;
}

export const TripCard = React.memo(function TripCard({ trip, onView, onEdit }: TripCardProps) {
  const { deleteTrip } = useTrips();
  const { settings } = useSettings();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    durationFormatted,
    hourlyRate,
    totalExpenses,
    deductions,
    net,
    formattedDate
  } = useMemo(() => {
    const durationMinutes = calculateDuration(trip.startTime, trip.endTime);
    const durationHours = durationMinutes / 60;
    const hourlyRate = durationHours > 0 ? trip.grossEarnings / durationHours : 0;
    const totalExpenses = trip.expenses.gasoline + trip.expenses.tolls + trip.expenses.food;
    const deductions = trip.miles * settings.deductionRate;
    const net = trip.grossEarnings - totalExpenses;
    const durationFormatted = `${Math.floor(durationHours)}h ${durationMinutes % 60}m`;
    const tripDate = new Date(trip.date);
    const formattedDate = format(new Date(tripDate.getTime() + tripDate.getTimezoneOffset() * 60000), 'EEE, MMM d');
    
    return { durationFormatted, hourlyRate, totalExpenses, deductions, net, formattedDate };
  }, [trip, settings.deductionRate]);


  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTrip(trip.id);
    setShowDeleteConfirm(false);
  }, [deleteTrip, trip.id]);

  const openDeleteDialog = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  }, []);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  }, [onEdit]);
  
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      <Card 
        className="overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md hover:bg-card/95 cursor-pointer"
        onClick={onView}
      >
        <CardHeader className="flex flex-row items-center justify-between p-3">
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg font-headline">{formattedDate}</CardTitle>
            <p className="font-semibold text-base text-muted-foreground">{durationFormatted}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={stopPropagation}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={stopPropagation}>
              <DropdownMenuItem onClick={handleEditClick}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openDeleteDialog} className="text-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        {trip.odometerStart !== null && trip.odometerEnd !== null && (
            <>
                <Separator />
                <div className="flex items-center justify-center gap-4 px-3 py-2 text-sm bg-muted/30">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Gauge className="w-4 h-4"/>
                        <span className="font-mono">{trip.odometerStart.toLocaleString()}</span>
                    </div>
                    <div className="font-mono text-muted-foreground">-</div>
                     <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-mono">{trip.odometerEnd.toLocaleString()}</span>
                     </div>
                </div>
            </>
        )}

        <Separator />
        <CardContent className="p-3 text-sm">
            <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-center">
                {/* Row 1 */}
                <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Miles</p>
                    <p className="font-semibold text-base">{trip.miles.toFixed(1)}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Deduction</p>
                    <p className="font-semibold text-base">{formatCurrency(deductions, settings.currency)}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">$/hour</p>
                    <p className="font-semibold text-base">{formatCurrency(hourlyRate, settings.currency)}</p>
                </div>
                
                {/* Row 2 */}
                <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Gross</p>
                    <p className="font-semibold text-base text-green-500">{formatCurrency(trip.grossEarnings, settings.currency)}</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Expenses</p>
                    <p className="font-semibold text-base text-red-500">{formatCurrency(totalExpenses, settings.currency)}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Net</p>
                    <p className={cn("font-semibold text-base", net >= 0 ? 'text-green-400': 'text-red-400')}>{formatCurrency(net, settings.currency)}</p>
                </div>
            </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent onClick={stopPropagation}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your trip record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

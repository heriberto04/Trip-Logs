"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
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


interface TripCardProps {
  trip: Trip;
  onEdit: () => void;
}

export function TripCard({ trip, onEdit }: TripCardProps) {
  const { deleteTrip } = useTrips();
  const { settings } = useSettings();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const durationMinutes = calculateDuration(trip.startTime, trip.endTime);
  const durationHours = durationMinutes / 60;
  const hourlyRate = durationHours > 0 ? trip.grossEarnings / durationHours : 0;
  const totalExpenses = trip.expenses.gasoline + trip.expenses.tolls + trip.expenses.food;
  const deductions = trip.miles * settings.deductionRate;
  const net = trip.grossEarnings - totalExpenses;

  const durationFormatted = `${Math.floor(durationHours)}h ${durationMinutes % 60}m`;

  const handleDelete = () => {
    deleteTrip(trip.id);
    setShowDeleteConfirm(false);
  };
  
  const tripDate = new Date(trip.date);
  const formattedDate = format(new Date(tripDate.getTime() + tripDate.getTimezoneOffset() * 60000), 'EEE, MMM d');


  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-center justify-between p-2 bg-card">
          <CardTitle className="text-base font-headline">{formattedDate}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteConfirm(true)} className="text-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Duration</p>
            <p className="font-semibold">{durationFormatted}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Hourly Rate</p>
            <p className="font-semibold">{formatCurrency(hourlyRate, settings.currency)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">{settings.unit === 'miles' ? 'Miles' : 'Kilometers'}</p>
            <p className="font-semibold">{trip.miles}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Deductions</p>
            <p className="font-semibold">{formatCurrency(deductions, settings.currency)}</p>
          </div>
        </CardContent>
        <CardFooter className="p-2 bg-secondary/20 flex justify-between items-center">
            <div className="text-left">
                <p className="text-xs text-muted-foreground">Gross</p>
                <p className="font-semibold text-green-500 text-sm">{formatCurrency(trip.grossEarnings, settings.currency)}</p>
            </div>
            <div className="text-center">
                <p className="text-xs text-muted-foreground">Expenses</p>
                <p className="font-semibold text-red-500 text-sm">{formatCurrency(totalExpenses, settings.currency)}</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-muted-foreground">Net</p>
                <p className={cn(
                    "font-bold text-base",
                    net >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                    {formatCurrency(net, settings.currency)}
                </p>
            </div>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
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
}

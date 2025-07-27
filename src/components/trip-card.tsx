
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
import { Separator } from '@/components/ui/separator';


interface TripCardProps {
  trip: Trip;
  onView: () => void;
  onEdit: () => void;
}

export function TripCard({ trip, onView, onEdit }: TripCardProps) {
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTrip(trip.id);
    setShowDeleteConfirm(false);
  };
  
  const tripDate = new Date(trip.date);
  const formattedDate = format(new Date(tripDate.getTime() + tripDate.getTimezoneOffset() * 60000), 'EEE, MMM d');


  return (
    <>
      <Card 
        className="overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md hover:bg-card/95 cursor-pointer"
        onClick={onView}
      >
        <CardHeader className="flex flex-row items-center justify-between p-2 bg-card">
          <CardTitle className="text-lg font-headline">{formattedDate}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
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
        <Separator />
        <CardContent className="p-2 text-sm">
            <div className="grid grid-cols-4 gap-x-2 text-center">
                {/* Column 1 */}
                <div className="space-y-1 text-left">
                    <div>
                        <p className="text-muted-foreground text-xs">Duration</p>
                        <p className="font-semibold text-base">{durationFormatted}</p>
                    </div>
                     <div>
                        <p className="text-muted-foreground text-xs">Miles</p>
                        <p className="font-semibold text-base">{trip.miles}</p>
                    </div>
                </div>
                {/* Column 2 */}
                <div className="space-y-1 text-left">
                     <div>
                        <p className="text-muted-foreground text-xs">Expenses</p>
                        <p className="font-semibold text-base text-red-500">{formatCurrency(totalExpenses, settings.currency)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs">Deduction</p>
                        <p className="font-semibold text-base">{formatCurrency(deductions, settings.currency)}</p>
                    </div>
                </div>
                {/* Column 3 */}
                <div className="space-y-1 text-left">
                   <div>
                        <p className="text-muted-foreground text-xs">Gross</p>
                        <p className="font-semibold text-base text-green-500">{formatCurrency(trip.grossEarnings, settings.currency)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs">Net</p>
                        <p className={cn(
                            "font-semibold text-base",
                            net >= 0 ? 'text-green-400' : 'text-red-400'
                        )}>
                            {formatCurrency(net, settings.currency)}
                        </p>
                    </div>
                </div>
                 {/* Column 4 */}
                 <div className="space-y-1 text-right">
                   <div>
                        <p className="text-muted-foreground text-xs">$/hour</p>
                        <p className="font-semibold text-base">{formatCurrency(hourlyRate, settings.currency)}</p>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
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

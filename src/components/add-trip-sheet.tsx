"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useTrips } from '@/contexts/trips-context';
import { useVehicles } from '@/contexts/vehicles-context';
import type { Trip } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface AddTripSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  trip: Trip | null;
}

const tripSchema = z.object({
  date: z.date({ required_error: "A date is required." }),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  miles: z.coerce.number().min(0).optional().default(0),
  grossEarnings: z.coerce.number().min(0).optional().default(0),
  expenses: z.object({
    gasoline: z.coerce.number().min(0).optional().default(0),
    tolls: z.coerce.number().min(0).optional().default(0),
    food: z.coerce.number().min(0).optional().default(0),
  }),
  vehicleId: z.string().nullable().optional(),
});

type TripFormData = z.infer<typeof tripSchema>;

export function AddTripSheet({ isOpen, setIsOpen, trip }: AddTripSheetProps) {
  const { addTrip, updateTrip } = useTrips();
  const { vehicles } = useVehicles();

  const form = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      date: new Date(),
      startTime: '',
      endTime: '',
      miles: 0,
      grossEarnings: 0,
      expenses: { gasoline: 0, tolls: 0, food: 0 },
      vehicleId: null,
    },
  });

  useEffect(() => {
    if (trip) {
      form.reset({
        date: new Date(trip.date),
        startTime: trip.startTime,
        endTime: trip.endTime,
        miles: trip.miles,
        grossEarnings: trip.grossEarnings,
        expenses: trip.expenses,
        vehicleId: trip.vehicleId,
      });
    } else {
      form.reset();
    }
  }, [trip, form, isOpen]);


  const onSubmit = (data: TripFormData) => {
    const tripData = {
      ...data,
      date: format(data.date, 'yyyy-MM-dd'),
    };
    if (trip) {
      updateTrip({ ...trip, ...tripData });
    } else {
      addTrip(tripData);
    }
    setIsOpen(false);
    form.reset();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{trip ? 'Edit Trip' : 'Add New Trip'}</SheetTitle>
          <SheetDescription>
            {trip ? 'Update the details of your trip.' : 'Enter the details for your new trip.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Controller
              name="date"
              control={form.control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
             {form.formState.errors.date && <p className="text-red-500 text-xs">{form.formState.errors.date.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" type="time" {...form.register('startTime')} />
               {form.formState.errors.startTime && <p className="text-red-500 text-xs">{form.formState.errors.startTime.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="time" {...form.register('endTime')} />
              {form.formState.errors.endTime && <p className="text-red-500 text-xs">{form.formState.errors.endTime.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="miles">Miles</Label>
            <Input id="miles" type="number" step="0.1" {...form.register('miles')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grossEarnings">Gross Earnings</Label>
            <Input id="grossEarnings" type="number" step="0.01" {...form.register('grossEarnings')} />
          </div>

          <div className="space-y-2">
            <Label>Expenses</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input type="number" placeholder="Gas" step="0.01" {...form.register('expenses.gasoline')} />
              <Input type="number" placeholder="Tolls" step="0.01" {...form.register('expenses.tolls')} />
              <Input type="number" placeholder="Food" step="0.01" {...form.register('expenses.food')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleId">Vehicle</Label>
            <Controller
              name="vehicleId"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {vehicles.map(v => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.year} {v.make} {v.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          
          <SheetFooter>
            <Button type="submit">{trip ? 'Save Changes' : 'Save Trip'}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

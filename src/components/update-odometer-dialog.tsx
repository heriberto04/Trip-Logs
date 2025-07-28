
"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicles } from '@/contexts/vehicles-context';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format, parse } from 'date-fns';
import { Calendar } from './ui/calendar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOdometer } from '@/contexts/odometer-context';

interface UpdateOdometerDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const odometerSchema = z.object({
  vehicleId: z.string().min(1, 'Please select a vehicle.'),
  odometer: z.coerce.number().min(0, 'Odometer reading must be a positive number.'),
  date: z.date({ required_error: "A date is required." }),
});

type OdometerFormData = z.infer<typeof odometerSchema>;

export function UpdateOdometerDialog({ isOpen, setIsOpen }: UpdateOdometerDialogProps) {
  const { vehicles, updateVehicleOdometer, getVehicleById } = useVehicles();
  const { addOdometerReading } = useOdometer();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const form = useForm<OdometerFormData>({
    resolver: zodResolver(odometerSchema),
    defaultValues: {
        vehicleId: '',
        odometer: undefined,
        date: new Date(),
    }
  });

  const selectedVehicleId = form.watch('vehicleId');

  useEffect(() => {
    if (isOpen) {
        form.reset({
            vehicleId: vehicles.length > 0 ? vehicles[0].id : '',
            odometer: undefined,
            date: new Date(),
        });
    }
  }, [isOpen, vehicles, form]);

  useEffect(() => {
    if (selectedVehicleId) {
      const vehicle = getVehicleById(selectedVehicleId);
      if (vehicle && vehicle.odometer) {
        form.setValue('odometer', vehicle.odometer);
      } else {
        form.setValue('odometer', undefined);
      }
    }
  }, [selectedVehicleId, getVehicleById, form]);

  const onSubmit = (data: OdometerFormData) => {
    addOdometerReading({
        vehicleId: data.vehicleId,
        odometer: data.odometer,
        date: format(data.date, 'yyyy-MM-dd')
    });
    updateVehicleOdometer(data.vehicleId, data.odometer);
    toast({
      title: "Odometer Reading Saved",
      description: "The new odometer reading has been recorded.",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Odometer</DialogTitle>
          <DialogDescription>
            Select a vehicle and enter its current odometer reading. This will create a new entry.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Vehicle</Label>
            <Controller
              name="vehicleId"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map(v => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.year} {v.make} {v.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.vehicleId && <p className="text-red-500 text-xs">{form.formState.errors.vehicleId.message}</p>}
          </div>
          <div className="space-y-2">
             <Label htmlFor="date">Date</Label>
             <Controller
              name="date"
              control={form.control}
              render={({ field }) => (
                isMounted && isMobile ? (
                  <Input 
                    type="date"
                    value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        const date = parse(e.target.value, 'yyyy-MM-dd', new Date());
                        field.onChange(date);
                      } else {
                        field.onChange(null);
                      }
                    }}
                  />
                ) : (
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
                )
              )}
            />
            {form.formState.errors.date && <p className="text-red-500 text-xs">{form.formState.errors.date.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="odometer">Odometer</Label>
            <Input id="odometer" type="number" {...form.register('odometer')} />
            {form.formState.errors.odometer && <p className="text-red-500 text-xs">{form.formState.errors.odometer.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={vehicles.length === 0}>Save Reading</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

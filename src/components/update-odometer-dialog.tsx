
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
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UpdateOdometerDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const odometerSchema = z.object({
  vehicleId: z.string().min(1, 'Please select a vehicle.'),
  odometer: z.coerce.number().min(0, 'Odometer reading must be a positive number.'),
});

type OdometerFormData = z.infer<typeof odometerSchema>;

export function UpdateOdometerDialog({ isOpen, setIsOpen }: UpdateOdometerDialogProps) {
  const { vehicles, updateVehicleOdometer, getVehicleById } = useVehicles();
  const { toast } = useToast();
  
  const form = useForm<OdometerFormData>({
    resolver: zodResolver(odometerSchema),
    defaultValues: {
        vehicleId: '',
        odometer: undefined,
    }
  });

  const selectedVehicleId = form.watch('vehicleId');

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
    updateVehicleOdometer(data.vehicleId, data.odometer);
    toast({
      title: "Odometer Updated",
      description: "The vehicle's odometer reading has been saved.",
    });
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Odometer</DialogTitle>
          <DialogDescription>
            Select a vehicle and enter its current odometer reading.
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
            <Label htmlFor="odometer">Odometer</Label>
            <Input id="odometer" type="number" {...form.register('odometer')} />
            {form.formState.errors.odometer && <p className="text-red-500 text-xs">{form.formState.errors.odometer.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={vehicles.length === 0}>Save Odometer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

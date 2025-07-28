"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVehicles } from '@/contexts/vehicles-context';

interface AddVehicleDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const vehicleSchema = z.object({
  year: z.coerce.number().optional().nullable(),
  make: z.string().optional().default(''),
  model: z.string().optional().default(''),
  licensePlate: z.string().optional().default(''),
  odometer: z.coerce.number().optional().nullable(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

export function AddVehicleDialog({ isOpen, setIsOpen }: AddVehicleDialogProps) {
  const { addVehicle } = useVehicles();
  const { register, handleSubmit, reset } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });

  const onSubmit = (data: VehicleFormData) => {
    addVehicle(data);
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Enter the details of your vehicle. You can still save if some information is missing.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input id="year" type="number" {...register('year')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="make">Make/Brand</Label>
            <Input id="make" {...register('make')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input id="model" {...register('model')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licensePlate">License Plate</Label>
            <Input id="licensePlate" {...register('licensePlate')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="odometer">Odometer</Label>
            <Input id="odometer" type="number" {...register('odometer')} />
          </div>
          <DialogFooter>
            <Button type="submit">Save Vehicle</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

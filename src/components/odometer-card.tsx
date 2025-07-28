
"use client";

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gauge } from 'lucide-react';
import type { OdometerReading } from '@/lib/types';
import { useVehicles } from '@/contexts/vehicles-context';
import { format } from 'date-fns';
import { useSettings } from '@/contexts/settings-context';
import { cn } from '@/lib/utils';

interface OdometerCardProps {
  reading: OdometerReading;
}

export const OdometerCard = React.memo(function OdometerCard({ reading }: OdometerCardProps) {
  const { getVehicleById } = useVehicles();
  const { settings } = useSettings();

  const { vehicleName, formattedDate } = useMemo(() => {
    const vehicle = reading.vehicleId ? getVehicleById(reading.vehicleId) : null;
    const vehicleName = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle';
    
    const readingDate = new Date(reading.date);
    const formattedDate = format(new Date(readingDate.getTime() + readingDate.getTimezoneOffset() * 60000), 'EEE, MMM d');

    return { vehicleName, formattedDate };
  }, [reading, getVehicleById]);

  return (
    <Card className={cn("bg-card/80")}>
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center w-10 h-10 rounded-md bg-muted text-muted-foreground">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">{vehicleName}</p>
            <p className="text-xs text-muted-foreground">{formattedDate} - Odometer Update</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg font-mono">{reading.odometer.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{settings.unit}</p>
        </div>
      </CardContent>
    </Card>
  );
});

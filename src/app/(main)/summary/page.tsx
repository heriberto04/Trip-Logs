"use client";

import React, { useState, useMemo } from 'react';
import { useTrips } from '@/contexts/trips-context';
import { useSettings } from '@/contexts/settings-context';
import { SummaryCard } from '@/components/summary-card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { calculateDuration, formatCurrency } from '@/lib/utils';
import type { Trip } from '@/lib/types';
import { subDays } from 'date-fns';

type FilterType = '7days' | '30days' | 'year';

export default function SummaryPage() {
  const { trips } = useTrips();
  const { settings } = useSettings();
  const [filter, setFilter] = useState<FilterType>('7days');

  const filteredTrips = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    return trips.filter(trip => {
      const tripDate = new Date(trip.date);
      switch (filter) {
        case '7days':
          return tripDate >= subDays(now, 7);
        case '30days':
          return tripDate >= subDays(now, 30);
        case 'year':
          return tripDate.getFullYear() === currentYear;
        default:
          return true;
      }
    });
  }, [trips, filter]);

  const summaryData = useMemo(() => {
    return filteredTrips.reduce(
      (acc, trip) => {
        const durationMinutes = calculateDuration(trip.startTime, trip.endTime);
        const totalExpenses = trip.expenses.gasoline + trip.expenses.tolls + trip.expenses.food;
        
        acc.drivingTime += durationMinutes;
        acc.totalMiles += trip.miles;
        acc.grossEarnings += trip.grossEarnings;
        acc.totalExpenses += totalExpenses;
        
        return acc;
      },
      {
        drivingTime: 0,
        totalMiles: 0,
        grossEarnings: 0,
        totalExpenses: 0,
        tripCount: filteredTrips.length,
      }
    );
  }, [filteredTrips]);

  const drivingTimeHours = summaryData.drivingTime / 60;
  const avgHourlyRate = drivingTimeHours > 0 ? summaryData.grossEarnings / drivingTimeHours : 0;
  const totalDeductions = summaryData.totalMiles * settings.deductionRate;
  const totalNet = summaryData.grossEarnings - summaryData.totalExpenses;

  const formattedDrivingTime = `${Math.floor(drivingTimeHours)}h ${Math.round(summaryData.drivingTime % 60)}m`;

  return (
    <div className="container mx-auto p-4">

      <Tabs defaultValue="7days" onValueChange={(value) => setFilter(value as FilterType)} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="7days">Last 7 Days</TabsTrigger>
          <TabsTrigger value="30days">Last 30 Days</TabsTrigger>
          <TabsTrigger value="year">This Year</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-2 gap-4">
        <SummaryCard title="Driving Time" value={formattedDrivingTime} />
        <SummaryCard title={`Total ${settings.unit === 'miles' ? 'Miles' : 'Kilometers'}`} value={summaryData.totalMiles.toFixed(1)} />
        <SummaryCard title="Gross Earnings" value={formatCurrency(summaryData.grossEarnings, settings.currency)} valueColor="text-green-500" />
        <SummaryCard title="Avg. Hourly Rate" value={formatCurrency(avgHourlyRate, settings.currency)} />
        <SummaryCard title="Total Expenses" value={formatCurrency(summaryData.totalExpenses, settings.currency)} valueColor="text-red-500" />
        <SummaryCard title="Total Deductions" value={formatCurrency(totalDeductions, settings.currency)} />
        <SummaryCard 
          title="Total Net" 
          value={formatCurrency(totalNet, settings.currency)} 
          valueColor={net >= 0 ? 'text-green-400' : 'text-red-400'}
          className="col-span-2"
          isLarge
        />
      </div>
    </div>
  );
}

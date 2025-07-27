import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInMinutes } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function calculateDuration(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;
  // Use a dummy date because we only care about the time
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  if (end < start) {
    // Handle overnight case
    end.setDate(end.getDate() + 1);
  }
  return differenceInMinutes(end, start);
}

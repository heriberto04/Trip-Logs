import { Trip } from '../types';

export const generateSampleTrips = (): Trip[] => {
  const trips: Trip[] = [];
  const currentYear = new Date().getFullYear();
  
  // Generate some sample trips for the current year
  for (let i = 0; i < 10; i++) {
    const date = new Date(currentYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const miles = Math.floor(Math.random() * 200) + 50;
    const grossEarnings = Math.floor(Math.random() * 150) + 50;
    const gasExpense = Math.floor(Math.random() * 30) + 10;
    
    trips.push({
      id: Date.now().toString() + i,
      date: date.toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '16:00',
      odometerStart: 100000 + (i * 200),
      odometerEnd: 100000 + (i * 200) + miles,
      miles,
      grossEarnings,
      expenses: {
        gasoline: gasExpense,
        tolls: Math.floor(Math.random() * 15),
        food: Math.floor(Math.random() * 25) + 5,
      },
      vehicleId: 'sample-vehicle-1',
    });
  }
  
  return trips.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
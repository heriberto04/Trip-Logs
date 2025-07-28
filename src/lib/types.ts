export interface Trip {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  miles: number;
  grossEarnings: number;
  expenses: {
    gasoline: number;
    tolls: number;
    food: number;
  };
  vehicleId: string | null;
}

export interface Vehicle {
  id: string;
  year: number | null;
  make: string;
  model: string;
  licensePlate: string;
  odometer: number | null;
}

export interface AppSettings {
  unit: 'miles' | 'kilometers';
  currency: string;
  deductionRate: number;
}

export interface UserInfo {
  name: string;
  address: string;
  cityState: string;
  country: string;
  zipCode: string;
}

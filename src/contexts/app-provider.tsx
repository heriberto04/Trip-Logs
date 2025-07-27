import React from 'react';
import { TripsProvider } from './trips-context';
import { VehiclesProvider } from './vehicles-context';
import { SettingsProvider } from './settings-context';
import { UserInfoProvider } from './user-info-context';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <UserInfoProvider>
        <VehiclesProvider>
          <TripsProvider>{children}</TripsProvider>
        </VehiclesProvider>
      </UserInfoProvider>
    </SettingsProvider>
  );
}

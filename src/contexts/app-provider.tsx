
"use client";

import React, { createContext, useEffect, useState } from 'react';
import { TripsProvider, useTrips } from './trips-context';
import { VehiclesProvider, useVehicles } from './vehicles-context';
import { SettingsProvider, useSettings } from './settings-context';
import { UserInfoProvider, useUserInfo } from './user-info-context';
import Image from 'next/image';
import { OdometerProvider, useOdometer } from './odometer-context';

const AppLoadingContext = createContext<{ isReady: boolean }>({ isReady: false });

function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-background flex justify-center items-center z-[200]">
            <div className="flex flex-col items-center gap-4">
                <Image src="/icon.png" alt="Trip Logs Logo" width={256} height={256} className="w-32 h-32 animate-pulse" priority />
                <p className="text-muted-foreground">Loading your data...</p>
            </div>
        </div>
    );
}


function AppStateGate({ children }: { children: React.ReactNode }) {
    const { isReady: settingsReady } = useSettings();
    const { isReady: userInfoReady } = useUserInfo();
    const { isReady: vehiclesReady } = useVehicles();
    const { isReady: tripsReady } = useTrips();
    const { isReady: odometerReady } = useOdometer();

    const isAppReady = settingsReady && userInfoReady && vehiclesReady && tripsReady && odometerReady;
    
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if(isAppReady) {
            // Delay showing content slightly to avoid flash of loading screen on fast loads
            const timer = setTimeout(() => setShowContent(true), 200);
            return () => clearTimeout(timer);
        }
    }, [isAppReady]);


    if (!showContent) {
        return <LoadingScreen />;
    }

    return <>{children}</>;
}


export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <UserInfoProvider>
        <TripsProvider>
           <VehiclesProvider>
              <OdometerProvider>
                <AppStateGate>
                  {children}
                </AppStateGate>
              </OdometerProvider>
            </VehiclesProvider>
        </TripsProvider>
      </UserInfoProvider>
    </SettingsProvider>
  );
}

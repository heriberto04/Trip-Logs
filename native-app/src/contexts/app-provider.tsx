import React, { createContext, useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { TripsProvider, useTrips } from './trips-context';
import { VehiclesProvider, useVehicles } from './vehicles-context';
import { SettingsProvider, useSettings } from './settings-context';
import { UserInfoProvider, useUserInfo } from './user-info-context';
import { OdometerProvider, useOdometer } from './odometer-context';

const AppLoadingContext = createContext<{ isReady: boolean }>({ isReady: false });

function LoadingScreen() {
    return (
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 200
        }}>
            <View style={{ alignItems: 'center', gap: 16 }}>
                <View style={{ 
                    width: 128, 
                    height: 128, 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    borderRadius: 16,
                    backgroundColor: '#333'
                }}>
                    <Text style={{ fontSize: 48, color: '#fff' }}>🚗</Text>
                </View>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={{ color: '#ccc', fontSize: 16 }}>Loading your data...</Text>
            </View>
        </View>
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
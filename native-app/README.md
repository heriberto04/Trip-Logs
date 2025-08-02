# Trip Logs - React Native iOS App

This is the React Native iOS version of the Trip Logs web application. It provides the same core functionality as the web app but optimized for native iOS devices.

## Features

- **Trip Logging**: Record trips with start/end times, mileage, earnings, and expenses
- **Summary Dashboard**: View current year statistics and analytics
- **History**: Browse historical trip data organized by year
- **Settings**: Manage user information, app preferences, and vehicle data
- **Data Persistence**: All data stored locally using AsyncStorage

## Architecture

The React Native app maintains the same business logic as the web version while adapting the UI and storage layers for mobile:

### Key Adaptations Made:

1. **Storage Layer**: Replaced `localStorage` with `AsyncStorage` for React Native compatibility
2. **Navigation**: Replaced Next.js router with React Navigation bottom tabs
3. **UI Components**: Converted web components to React Native equivalents
4. **Styling**: Implemented native styling with dark theme optimization
5. **Context Providers**: Maintained same state management but adapted for async storage

### Project Structure:

```
src/
├── contexts/           # State management (adapted from web version)
│   ├── app-provider.tsx
│   ├── trips-context.tsx
│   ├── vehicles-context.tsx
│   ├── settings-context.tsx
│   ├── user-info-context.tsx
│   └── odometer-context.tsx
├── navigation/         # React Navigation setup
│   └── AppNavigator.tsx
├── screens/           # Main app screens
│   ├── TripsScreen.tsx
│   ├── SummaryScreen.tsx
│   ├── HistoryScreen.tsx
│   └── SettingsScreen.tsx
├── lib/              # Utilities and types
│   ├── storage.ts    # AsyncStorage wrapper
│   └── types.ts      # TypeScript definitions
└── App.tsx           # Main app component
```

## Setup and Development

### Prerequisites
- Node.js 18+
- React Native development environment
- iOS development tools (Xcode)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Install iOS dependencies:
```bash
cd ios && pod install && cd ..
```

3. Start Metro bundler:
```bash
npm run start
```

4. Run on iOS simulator:
```bash
npm run ios
```

### Build Commands

- `npm run typecheck` - Type checking
- `npm run lint` - Code linting
- `npm run test` - Run tests
- `npm run ios` - Run on iOS simulator/device
- `npm run start` - Start Metro bundler

## Data Migration

The React Native app uses the same data structures as the web version, making it possible to migrate data between platforms if needed. All data is stored locally on the device using AsyncStorage.

## Features Implemented

✅ **Core Architecture**
- React Native project setup with TypeScript
- React Navigation with bottom tabs
- AsyncStorage for data persistence
- Context-based state management

✅ **Screens Implemented**
- Trips screen with trip list display
- Summary screen with yearly statistics
- History screen with multi-year trip organization
- Settings screen with app configuration

✅ **Data Management**
- Trip creation, reading, updating, deletion
- Vehicle management
- User information storage
- App settings persistence
- Odometer reading tracking

## Future Enhancements

The following features can be added to enhance the native app experience:

- Trip creation/editing forms with native UI components
- Camera integration for receipt/document capture
- GPS integration for automatic mileage calculation
- Push notifications for trip reminders
- Native sharing for PDF export
- Biometric authentication for data security
- Offline-first data synchronization
- Dark/light theme switching

## Comparison with Web Version

| Feature | Web App | React Native App |
|---------|---------|------------------|
| Navigation | Next.js router | React Navigation |
| Storage | localStorage | AsyncStorage |
| UI Components | HTML/CSS | React Native |
| Platform | Browser | iOS Native |
| Performance | Web performance | Native performance |
| Access | Web browser | App Store |

The React Native version provides a native mobile experience while maintaining the same core functionality and business logic as the web application.
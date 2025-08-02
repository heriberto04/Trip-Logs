# Trip Logs - iOS Native App

This is the iOS native version of the Trip Logs web application, built using React Native.

## Features

- **Trip Logging**: Track your vehicle trips with detailed information including date, time, miles, earnings, and expenses
- **Summary Dashboard**: View comprehensive statistics for the current year including total trips, miles, earnings, and expenses
- **Historical Data**: Browse trip data organized by year with quick statistics
- **Local Storage**: All data is stored locally on your device using AsyncStorage
- **Settings**: App information and privacy details

## Project Structure

```
src/
├── components/         # Reusable UI components
├── contexts/          # React Context providers (TripsContext)
├── screens/           # Main app screens
│   ├── TripsScreen.tsx        # Main trip listing screen
│   ├── SummaryScreen.tsx      # Summary dashboard
│   ├── HistoryScreen.tsx      # Historical data view
│   └── SettingsScreen.tsx     # Settings and app info
├── types/             # TypeScript type definitions
└── utils/             # Helper functions and utilities
```

## Getting Started

### Prerequisites

- Xcode 12.0 or later
- iOS Simulator or physical iOS device
- Node.js 18 or later
- React Native CLI

### Installation

1. Navigate to the iOS project directory:
   ```bash
   cd iOS/TripLogs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install iOS dependencies (requires macOS):
   ```bash
   npx pod-install ios
   ```

4. Run the app:
   ```bash
   npm run ios
   ```

### Development

- **Start Metro bundler**: `npm start`
- **Run on iOS simulator**: `npm run ios`
- **Run tests**: `npm run test`
- **Lint code**: `npm run lint`

## Data Storage

The app uses AsyncStorage to persist data locally on the device. The following data is stored:

- Trip logs with earnings and expense details
- App automatically initializes with sample data on first launch

## Privacy

All data is stored exclusively on your local device. No data is transmitted to external servers, ensuring complete privacy and data security.

## Converting from Web App

This iOS app was converted from the original Next.js web application with the following key changes:

- **Navigation**: Replaced Next.js routing with React Navigation bottom tabs
- **Storage**: Replaced localStorage with AsyncStorage
- **UI Components**: Converted from Radix UI components to React Native components
- **Styling**: Replaced Tailwind CSS with React Native StyleSheet

## License

© 2025 Trip Logs. All rights reserved.
# BudgetBuddy - Budget & Bills Tracker

A React Native mobile app built with Expo for tracking personal finances, budgets, and bills.

## Features

- 📊 Track income and expenses
- 💰 Set and monitor monthly budgets
- 📋 Manage recurring bills
- 📈 View spending statistics
- 🎨 Light/Dark theme support

## Tech Stack

- **Framework**: React Native (Expo SDK 54)
- **Navigation**: React Navigation (Tabs + Stack)
- **Backend**: Firebase (Auth + Firestore)
- **Language**: JavaScript

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your phone (for testing)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Copy `.env.example` to `.env`
   - Fill in your Firebase credentials

4. Start the development server:
   ```bash
   npx expo start
   ```

5. Scan the QR code with Expo Go app

## Project Structure

```
src/
├── components/     # Shared UI components
├── hooks/          # Custom React hooks
├── navigation/     # Navigation configuration
├── screens/        # App screens
├── services/       # Firebase and API services
├── theme/          # Design tokens and theming
└── utils/          # Utility functions
```

## Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in browser

## License

MIT

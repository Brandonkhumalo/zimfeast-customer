# ZimFeast Customer App

## Overview
ZimFeast is a React Native mobile application built with Expo for food delivery services in Zimbabwe. The app allows customers to browse restaurants, place orders, and track deliveries.

## Recent Changes (October 14, 2025)
- Configured project for mobile development using Expo
- Removed web configuration, focused on iOS and Android platforms
- Set up Expo dev server with LAN mode for local network access
- Updated TypeScript configuration for React Native
- Installed necessary dependencies including @expo/ngrok for tunneling support

## Project Architecture

### Technology Stack
- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack)
- **State Management**: TanStack React Query
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **UI Components**: Custom UI components with shadcn/ui-inspired design

### Project Structure
```
src/
├── components/        # Reusable UI components
│   ├── ui/           # Base UI components (buttons, cards, etc.)
│   ├── Cart.tsx
│   ├── Navbar.tsx
│   └── RestaurantCard.tsx
├── pages/            # Screen components
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── RegisterPage.tsx
│   ├── Home.tsx
│   ├── CustomerApp.tsx
│   └── Checkout.tsx
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations
└── App.tsx           # Main app component with navigation setup
```

### Backend Integration
The app connects to a backend API at http://192.168.1.9:8000 with the following endpoints:
- `/api/accounts/login/` - User authentication
- `/api/accounts/register/` - User registration
- `/api/accounts/profile/` - User profile
- `/api/restaurants/` - Restaurant listings
- `/api/orders/` - Order management
- `/api/payments/` - Payment processing

**Important Note**: The API URLs are configured to connect to the backend at 192.168.1.9:8000 (user's backend server on local network).

## Running the App

### Development Server
The app runs using Expo's development server:
```bash
npm start
```

This will:
1. Start Metro bundler
2. Generate a QR code
3. Make the app available on your local network

### Connecting from Mobile Device

#### Option 1: Expo Go (Recommended for Development)
1. Install Expo Go app on your phone from App Store (iOS) or Play Store (Android)
2. Make sure your phone is on the same WiFi network as your development machine
3. Scan the QR code displayed in the console with:
   - **iOS**: Camera app (will open Expo Go)
   - **Android**: Expo Go app's built-in scanner

#### Option 2: Development Build
Run platform-specific commands:
- Android: `npm run android`
- iOS: `npm run ios` (requires macOS with Xcode)

### Important Configuration Notes

1. **Network Access**: The dev server uses `--lan` mode, which works when your phone and computer are on the same network.

2. **API Endpoints**: Update API URLs in the following files if your backend is not on localhost:
   - `src/components/Navbar.tsx`
   - `src/hooks/useAuth.ts`
   - `src/pages/RegisterPage.tsx`
   - `src/components/Cart.tsx`
   - `src/pages/checkout-components/CheckoutForm.tsx`
   - `src/pages/customer-components/CartComponent.tsx`
   - `src/pages/customer-components/TopRestaurants.tsx`

3. **Environment Variables**: For Google Maps API and other services, you may need to set up environment variables.

## Package Compatibility Notes
The project uses:
- React Native 0.81.4 (requires Node >= 20.19.4, currently using 20.19.3)
- Some packages show engine warnings but should work correctly
- Consider updating `@react-native-picker/picker` and `babel-preset-expo` for best Expo 54 compatibility

## User Preferences
- Mobile-first development focus
- Keep all backend API URLs unchanged (user will handle backend configuration separately)
- No web version - iOS and Android only

## Known Issues
- Some package version mismatches with Expo 54 (see console warnings)
- Backend API URLs point to localhost - needs updating for mobile device access

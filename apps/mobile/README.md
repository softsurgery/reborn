# Reborn Mobile App V2

A modern mobile application built with **React Native** and **Expo**, utilizing **Expo Router** for file-based routing and **NativeWind** for styling.

## 🚀 Features

- **File-based Routing**: Powered by `expo-router`.
- **Modern UI Components**: Using `@rn-primitives` and Radix UI-inspired components.
- **Styling**: utility-first CSS with **NativeWind** (Tailwind CSS for React Native).
- **State Management**: Efficient state handling with **Zustand** and **React Query**.
- **Internationalization**: Multi-language support via `i18next`.
- **Real-time Communication**: Integrated with `socket.io-client` for chat and notifications.
- **Maps & Location**: Native map integration and live geolocation tracking.
- **Theming**: Light and dark mode support.

## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 54)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) / Tailwind CSS
- **Icons**: [Lucide React Native](https://lucide.dev/)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) & [Lottie](https://github.com/lottie-react-native/lottie-react-native)
- **Forms & Validation**: [Zod](https://zod.dev/)

## 📂 Project Structure

```bash
reborn-mobile-app-v2/
├── api/          # API services & Axios configuration
├── app/          # Expo Router pages (Screens)
│   ├── auth/     # Authentication flow (Sign In/Up)
│   └── main/     # Main application flow
├── assets/       # Images, fonts, and animations
├── components/   # Reusable UI components
├── contexts/     # React Context providers
├── hooks/        # Custom React hooks
├── i18n/         # Localization files
├── lib/          # Utilities and helper functions
├── types/        # TypeScript type definitions
└── constants/    # Global constants & theme config
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Yarn](https://yarnpkg.com/) or npm
- [Expo Go](https://expo.dev/client) app on your device or an emulator

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Start the development server:
   ```bash
   yarn dev
   ```

### Available Scripts

- `yarn dev`: Starts the Expo development server with cache cleared.
- `yarn android`: Starts the app on an Android emulator/device.
- `yarn ios`: Starts the app on an iOS simulator/device.
- `yarn web`: Starts the app in a web browser.
- `yarn clean`: Removes `.expo` and `node_modules`.

## 📱 Development

- **Adding Components**: UI primitives are located in `components/ui/`.
- **Styling**: Use Tailwind classes via the `className` prop.
- **Environment Variables**: Managed via `.env` file (see `.env.example`).

## 📄 License

Internal Project - All Rights Reserved.

# Rubiks Vision

A React Native app that uses computer vision to scan and solve Rubik's cubes. The app captures images of each face of the cube, analyzes the colors, and provides a solution using the min2phase algorithm.

## Features

- 📱 **Cross-platform**: Works on iOS and Android
- 📷 **Camera Integration**: Uses react-native-vision-camera for high-quality image capture
- 🎯 **Color Detection**: Automatically detects cube face colors using computer vision
- 🧩 **Cube Solving**: Implements min2phase.js algorithm for cube solving
- 🎨 **Modern UI**: Clean, intuitive interface with React Navigation
- 📊 **State Management**: Uses Zustand for efficient state management

## Screens

- **ScanFaceScreen**: Capture and analyze individual cube faces
- **ReviewFacesScreen**: Review and edit detected colors
- **CenterPickerScreen**: Select center colors for each face
- **SolveScreen**: Display the solution steps

## Prerequisites

Before running this app, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **iOS Development** (for iOS):
  - Xcode (latest version)
  - iOS Simulator or physical device
- **Android Development** (for Android):
  - Android Studio
  - Android SDK
  - Android Emulator or physical device

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd rubiks-vision
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Expo CLI globally** (if not already installed):
   ```bash
   npm install -g @expo/cli
   ```

## Quick Start

### Option 1: One-Command iOS Setup (Recommended)

For iOS development, use the automated setup script:

```bash
# Make the script executable
chmod +x ios-setup-and-run.sh

# Run the complete setup and launch
./ios-setup-and-run.sh
```

This script will:
- Generate the native iOS project
- Configure Xcode build settings
- Install required Ruby gems
- Build and launch on your device

### Option 2: Manual Setup

#### For iOS:

1. **Generate native project**:
   ```bash
   npx expo prebuild --platform ios
   ```

2. **Install iOS dependencies**:
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Run on iOS**:
   ```bash
   npx expo run:ios
   ```

#### For Android:

1. **Generate native project**:
   ```bash
   npx expo prebuild --platform android
   ```

2. **Run on Android**:
   ```bash
   npx expo run:android
   ```

#### For Development:

1. **Start Metro bundler**:
   ```bash
   npm start
   # or
   npx expo start
   ```

2. **Open in Expo Go** (for testing):
   - Scan the QR code with Expo Go app
   - Or press `i` for iOS simulator
   - Or press `a` for Android emulator

## Development Commands

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Type checking
npm run type-check

# Clean build
npm run clean

# Metro bundler
npm run metro
```

## Project Structure

```
rubiks-vision/
├── app/                    # Main application code
│   ├── components/         # Reusable UI components
│   ├── lib/               # Utility functions and algorithms
│   ├── navigation/         # Navigation configuration
│   ├── screens/           # App screens
│   ├── store/             # State management (Zustand)
│   └── App.tsx            # Main app component
├── ios/                   # iOS native code
├── android/               # Android native code
├── assets/                # Static assets
├── types/                 # TypeScript type definitions
└── ios-setup-and-run.sh  # Automated iOS setup script
```

## Key Dependencies

- **React Native**: Core framework
- **Expo**: Development platform and tools
- **react-native-vision-camera**: Camera functionality
- **react-native-pixel-color**: Color detection
- **min2phase.js**: Rubik's cube solving algorithm
- **@react-navigation/native**: Navigation
- **zustand**: State management
- **react-native-svg**: SVG rendering

## Troubleshooting

### Common Issues

1. **iOS Build Issues**:
   - Make sure Xcode is up to date
   - Clean build folder: `npx expo run:ios --clear`
   - Reset Metro cache: `npx expo start --clear`

2. **Android Build Issues**:
   - Ensure Android SDK is properly configured
   - Clean build: `cd android && ./gradlew clean && cd ..`

3. **Camera Permissions**:
   - iOS: Add camera permission in Xcode
   - Android: Ensure camera permission is granted

4. **Metro Bundler Issues**:
   - Clear cache: `npx expo start --clear`
   - Reset watchman: `watchman watch-del-all`

### Getting Help

- Check the [Expo documentation](https://docs.expo.dev/)
- Review [React Native troubleshooting guide](https://reactnative.dev/docs/troubleshooting)
- For camera issues, see [react-native-vision-camera docs](https://react-native-vision-camera.com/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note**: This app requires camera permissions to function properly. Make sure to grant camera access when prompted.

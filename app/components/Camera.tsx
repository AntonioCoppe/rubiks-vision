import React from 'react';

// Check if we're on web
const isWeb = typeof (globalThis as any).window !== 'undefined';

// Import the real camera for native platforms
let NativeCamera: any = null;
if (!isWeb) {
  try {
    NativeCamera = require('react-native-vision-camera').Camera;
  } catch (error) {
    console.warn('Camera not available on this platform');
  }
}

// Import the web camera placeholder
let WebCamera: any = null;
if (isWeb) {
  WebCamera = require('./WebCamera').default;
}

interface CameraProps {
  onCapture?: () => void;
  children?: React.ReactNode;
  [key: string]: any; // Allow other props to pass through
}

export default function Camera(props: CameraProps) {
  if (isWeb) {
    return <WebCamera {...props} />;
  }
  
  if (NativeCamera) {
    return <NativeCamera {...props} />;
  }
  
  // Fallback for when camera is not available
  return (
    <div style={{ 
      flex: 1, 
      backgroundColor: '#000', 
      justifyContent: 'center', 
      alignItems: 'center',
      color: '#fff'
    }}>
      Camera not available on this platform
    </div>
  );
} 
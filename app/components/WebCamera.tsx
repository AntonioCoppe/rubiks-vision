import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface WebCameraProps {
  onCapture?: () => void;
  children?: React.ReactNode;
}

export default function WebCamera({ onCapture, children }: WebCameraProps) {
  return (
    <View style={styles.container}>
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.placeholderText}>📷 Camera Preview</Text>
        <Text style={styles.subText}>Camera functionality requires native build</Text>
        <Pressable style={styles.captureButton} onPress={onCapture}>
          <Text style={styles.buttonText}>Capture Photo</Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 10,
  },
  subText: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  captureButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 
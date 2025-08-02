import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import Camera from '../components/Camera';
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import CameraGridOverlay, { GRID_SIZE } from '../components/CameraGridOverlay';
import { HSV, medianHSV, classifyByCenters, RGB } from '../lib/color';
import PixelColor from 'react-native-pixel-color';
import { useCubeStore } from '../store/cubeStore';
import { Face, Color } from '../../types/cube';

// Convert hex (#RRGGBB or #AARRGGBB) to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  if (hex.startsWith('#')) hex = hex.slice(1);
  if (hex.length === 8) hex = hex.slice(2); // drop alpha if present
  const num = parseInt(hex, 16);
  return { r: (num >> 16) & 0xff, g: (num >> 8) & 0xff, b: num & 0xff };
}

// Sample a small square of pixels around a center point and return RGB values.
async function samplePatchColors(
  uri: string,
  width: number,
  height: number,
  cx: number,
  cy: number,
  pad: number
): Promise<RGB[]> {
  const pixels: RGB[] = [];
  const step = Math.max(1, Math.floor(pad / 3)); // sparse sampling
  for (let y = cy - pad; y <= cy + pad; y += step) {
    for (let x = cx - pad; x <= cx + pad; x += step) {
      if (x < 0 || y < 0 || x >= width || y >= height) continue;
      try {
        // PixelColor.getHex returns a HEX string (#RRGGBB)
        const hex = await (PixelColor as any).getHex(uri, { x, y, width, height });
        const { r, g, b } = hexToRgb(hex as string);
        pixels.push({ r, g, b });
      } catch {
        // ignore sampling errors
      }
    }
  }
  return pixels;
}


type Props = { route: { params: { face: Face } }; navigation: any };

export default function ScanFaceScreen({ route, navigation }: Props) {
  const face = route.params.face;
  const camera = useRef(null);
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [previewReady, setPreviewReady] = useState(false);
  const { centers, setFace, setCenter } = useCubeStore();

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  const onCapture = useCallback(async () => {
    if (!camera.current) return;
    const photo = await camera.current.takePhoto({ qualityPrioritization: 'speed' });

    const { path, width, height } = photo as unknown as { path: string; width: number; height: number };

    if (!width || !height) {
      Alert.alert('Error', 'Unable to determine image size.');
      return;
    }

    // Compute 9 sample patches (small squares around 9 grid centers)
    const patches: RGB[][] = [];
    const cell = Math.floor(Math.min(width, height) / 3);
    const pad = Math.floor(cell * 0.18); // small patch inside each cell
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cx = Math.floor(col * cell + cell / 2);
        const cy = Math.floor(row * cell + cell / 2);
        const rgbPatch = await samplePatchColors(path, width, height, cx, cy, pad);
        patches.push(rgbPatch);
      }
    }

    const hsvs: HSV[] = patches.map(medianHSV);

    // If we don't know this face's center yet, ask the user to pick it.
    if (!centers[face]) {
      navigation.navigate('CenterPicker', { face, centerHSV: hsvs[4] });
      return;
    }

    const centerArray = (Object.values(centers).filter(Boolean) as Array<{ h: number; s: number; v: number; color: Color }>).map((c) => ({
      h: c.h,
      s: c.s,
      v: c.v,
      color: c.color,
    }));

    const stickers: Color[] = hsvs.map((h) => classifyByCenters(h, centerArray));

    // Confidence heuristic: avg distance to nearest center
    const dists = hsvs.map((h) => {
      let best = Infinity;
      for (const c of centerArray) {
        const dh = Math.min(Math.abs(h.h - c.h), 360 - Math.abs(h.h - c.h)) / 180;
        const ds = Math.abs(h.s - c.s);
        const dv = Math.abs(h.v - c.v);
        const d = 2 * dh + ds + 0.5 * dv;
        if (d < best) best = d;
      }
      return best;
    });
    const conf = Math.max(0, 1 - dists.reduce((a, b) => a + b, 0) / dists.length);

    setFace(face, stickers);
    navigation.navigate('Review');
  }, [camera, centers, face, setCenter, setFace, navigation]);

  if (!device || !hasPermission) {
    return (
      <View style={styles.center}>
        <Text>Initializing camera…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        ref={camera}
        photo
        onInitialized={() => setPreviewReady(true)}
      />
      <View style={{ width: GRID_SIZE, height: GRID_SIZE }}>
        <CameraGridOverlay />
      </View>
      <View style={styles.bottomBar}>
        <Text style={styles.caption}>Align the {face} face inside the square</Text>
        <Pressable style={styles.shutter} onPress={onCapture}>
          <Text style={{ color: 'black' }}>Scan</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottomBar: { position: 'absolute', bottom: 24, alignItems: 'center', gap: 8 },
  caption: { color: 'white', fontSize: 16 },
  shutter: { backgroundColor: 'white', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 },
});


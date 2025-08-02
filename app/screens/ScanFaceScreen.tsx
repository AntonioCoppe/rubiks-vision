import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import CameraGridOverlay, { GRID_SIZE } from '../components/CameraGridOverlay';
import { HSV, medianHSV, classifyByCenters, RGB } from '../lib/color';
import { useCubeStore } from '../store/cubeStore';
import { Face, Color } from '../../types/cube';

// TODO: Replace with actual pixel loader implementation
async function loadPixels(_path: string): Promise<{ data: Uint8Array; width: number; height: number }> {
  Alert.alert(
    'Not Implemented',
    'Pixel loading is not implemented in this MVP. Replace loadPixels with a real implementation.'
  );
  return { data: new Uint8Array(), width: 0, height: 0 };
}

// TODO: Replace with heuristic or UI picker
function guessCenterColor(_hsv: HSV): Color {
  // naive guess
  return 'W';
}

type Props = { route: { params: { face: Face } }; navigation: any };

export default function ScanFaceScreen({ route, navigation }: Props) {
  const face = route.params.face;
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [previewReady, setPreviewReady] = useState(false);
  const centers = useCubeStore((s) => s.centers);
  const setFace = useCubeStore((s) => s.setFace);
  const setCenter = useCubeStore((s) => s.setCenter);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  const onCapture = useCallback(async () => {
    if (!camera.current) return;
    const photo = await camera.current.takePhoto({ qualityPrioritization: 'speed' });

    // NOTE: loadPixels needs a real implementation for production use
    const { data, width, height } = await loadPixels(photo.path);

    if (!data.length) {
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
        const rgbPatch: RGB[] = [];
        for (let y = cy - pad; y <= cy + pad; y++) {
          for (let x = cx - pad; x <= cx + pad; x++) {
            const idx = (y * width + x) * 4;
            rgbPatch.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
          }
        }
        patches.push(rgbPatch);
      }
    }

    const hsvs: HSV[] = patches.map(medianHSV);

    // First time we see a face, capture its center sticker as calibration if missing:
    if (!centers[face]) {
      const guessed: Color = guessCenterColor(hsvs[4]);
      setCenter(face, hsvs[4], guessed);
    }

    const centerArray = Object.values(centers).map((c) => ({
      h: c!.h,
      s: c!.s,
      v: c!.v,
      color: c!.color,
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

    setFace(face, stickers, conf);
    navigation.navigate('ReviewFaces');
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


import React, { useMemo } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useCubeStore } from '../store/cubeStore';
import { isMaybeLegal } from '../lib/legality';

export default function ReviewFacesScreen({ navigation }: any) {
  const faces = useCubeStore((s) => s.faces);

  const ready = useMemo(
    () => ['U', 'R', 'F', 'D', 'L', 'B'].every((f) => faces[f as any]?.length === 9),
    [faces]
  );

  const onContinue = () => {
    if (!ready) return;
    const state = { faces: faces as any };
    if (!isMaybeLegal(state as any)) {
      Alert.alert('Scan issue', 'Color counts look off. Rescan suspicious face(s).');
      return;
    }
    navigation.navigate('Solve', { state });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Review scans</Text>
      {/* TODO: show mini diagrams and allow rescanning */}
      <Pressable
        disabled={!ready}
        onPress={onContinue}
        style={{
          marginTop: 24,
          opacity: ready ? 1 : 0.5,
          backgroundColor: 'black',
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Solve</Text>
      </Pressable>
    </View>
  );
}


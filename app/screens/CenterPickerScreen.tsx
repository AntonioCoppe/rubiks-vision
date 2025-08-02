import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Face, Color } from '../../types/cube';
import { HSV } from '../lib/color';
import { useCubeStore } from '../store/cubeStore';

const COLOR_SWATCH: Record<Color, string> = {
  W: '#ffffff',
  R: '#ff0000',
  B: '#0000ff',
  O: '#ff7f00',
  G: '#00ff00',
  Y: '#ffff00',
};

interface Props {
  route: { params: { face: Face; centerHSV: HSV } };
  navigation: any;
}

export default function CenterPickerScreen({ route, navigation }: Props) {
  const { face, centerHSV } = route.params;
  const { setCenter } = useCubeStore();

  const choose = (color: Color) => {
    setCenter(face, centerHSV, color);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Pick the center color for the {face} face</Text>
      { (Object.keys(COLOR_SWATCH) as Color[]).map((c) => (
        <Pressable
          key={c}
          onPress={() => choose(c)}
          style={{
            backgroundColor: COLOR_SWATCH[c],
            paddingVertical: 12,
            paddingHorizontal: 24,
            marginVertical: 4,
            borderRadius: 8,
            width: 160,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: c === 'W' ? 'black' : 'white', fontWeight: '600' }}>{c}</Text>
        </Pressable>
      ))}
    </View>
  );
}

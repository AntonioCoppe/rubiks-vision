import React from 'react';
import Svg, { Rect } from 'react-native-svg';
import { View } from 'react-native';

export const GRID_SIZE = 300;

export default function CameraGridOverlay() {
  const cell = GRID_SIZE / 3;
  return (
    <View style={{ position: 'absolute', width: GRID_SIZE, height: GRID_SIZE }}>
      <Svg width={GRID_SIZE} height={GRID_SIZE}>
        {/* outer square */}
        <Rect x={0} y={0} width={GRID_SIZE} height={GRID_SIZE} stroke="white" strokeWidth={2} fill="none" />
        {/* grid lines */}
        {[1, 2].map((i) => (
          <React.Fragment key={i}>
            <Rect x={i * cell} y={0} width={1} height={GRID_SIZE} fill="white" />
            <Rect x={0} y={i * cell} width={GRID_SIZE} height={1} fill="white" />
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}


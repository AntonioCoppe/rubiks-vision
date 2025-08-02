import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface MoveStepperProps {
  currentIndex: number;
  totalMoves: number;
  onPrevious: () => void;
  onNext: () => void;
  currentMove?: string;
}

export default function MoveStepper({ currentIndex, totalMoves, onPrevious, onNext, currentMove }: MoveStepperProps) {
  return (
    <View style={{ alignItems: 'center', gap: 12 }}>
      <Text style={{ fontSize: 16 }}>Step {currentIndex + 1} / {totalMoves}</Text>
      <Text style={{ fontSize: 36, fontWeight: '800' }}>{currentMove ?? '...'}</Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Pressable 
          onPress={onPrevious} 
          disabled={currentIndex <= 0}
          style={{ 
            padding: 12, 
            backgroundColor: currentIndex <= 0 ? '#ccc' : '#eee', 
            borderRadius: 8 
          }}
        >
          <Text style={{ color: currentIndex <= 0 ? '#999' : '#000' }}>Back</Text>
        </Pressable>
        <Pressable 
          onPress={onNext} 
          disabled={currentIndex >= totalMoves - 1}
          style={{ 
            padding: 12, 
            backgroundColor: currentIndex >= totalMoves - 1 ? '#ccc' : 'black', 
            borderRadius: 8 
          }}
        >
          <Text style={{ color: currentIndex >= totalMoves - 1 ? '#999' : 'white' }}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

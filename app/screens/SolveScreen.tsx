import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { to54String } from '../lib/mapping';
import { solveCube } from '../lib/solver';
import { useCubeStore } from '../store/cubeStore';

export default function SolveScreen({ route }: any) {
  const { state } = route.params;
  const [idx, setIdx] = useState(0);
  const [moves, setMoves] = useState<string[]>([]);
  const setSolution = useCubeStore((s) => s.setSolution);

  useEffect(() => {
    (async () => {
      const s54 = to54String(state);
      const sol = await solveCube(s54);
      setMoves(sol);
      setSolution(sol);
    })();
  }, [state, setSolution]);

  const next = () => setIdx((i) => Math.min(i + 1, moves.length - 1));
  const prev = () => setIdx((i) => Math.max(i - 1, 0));

  return (
    <View style={{ flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 16 }}>Step {idx + 1} / {moves.length}</Text>
      <Text style={{ fontSize: 36, fontWeight: '800' }}>{moves[idx] ?? '...'}</Text>
      {/* TODO: Add cube diagram highlighting the face here */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
        <Pressable onPress={prev} style={{ padding: 12, backgroundColor: '#eee', borderRadius: 8 }}>
          <Text>Back</Text>
        </Pressable>
        <Pressable onPress={next} style={{ padding: 12, backgroundColor: 'black', borderRadius: 8 }}>
          <Text style={{ color: 'white' }}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}


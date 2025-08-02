import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { to54String } from '../lib/mapping';
import { solveCube } from '../lib/solver';
import { useCubeStore } from '../store/cubeStore';
import MoveStepper from '../components/MoveStepper';

export default function SolveScreen({ route }: any) {
  const { state } = route.params;
  const [idx, setIdx] = useState(0);
  const [moves, setMoves] = useState([] as string[]);
  const { setSolution } = useCubeStore();

  useEffect(() => {
    (async () => {
      const s54 = to54String(state);
      const sol = await solveCube(s54);
      setMoves(sol);
      setSolution(sol);
    })();
  }, [state, setSolution]);

  const next = () => setIdx((i: number) => Math.min(i + 1, moves.length - 1));
  const prev = () => setIdx((i: number) => Math.max(i - 1, 0));

  return (
    <View style={{ flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' }}>
      <MoveStepper
        currentIndex={idx}
        totalMoves={moves.length}
        onPrevious={prev}
        onNext={next}
        currentMove={moves[idx]}
      />
    </View>
  );
}


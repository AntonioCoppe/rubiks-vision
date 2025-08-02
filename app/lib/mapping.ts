import { CubeState, Face, Color } from '../../types/cube';

// Standard net order for many solvers: U, R, F, D, L, B
const order: Face[] = ['U', 'R', 'F', 'D', 'L', 'B'];

export const to54String = (state: CubeState): string => {
  return order.map((f) => state.faces[f]!.join('')).join('');
};

// Quick check: each color appears exactly 9 times
export const countColorsOk = (state: CubeState) => {
  const counts: Record<Color, number> = { W: 0, R: 0, B: 0, O: 0, G: 0, Y: 0 };
  Object.values(state.faces).forEach((face) => {
    face!.forEach((c) => (counts[c]++));
  });
  return Object.values(counts).every((n) => n === 9);
};


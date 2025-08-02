import { CubeState, Face, Color } from '../../types/cube';

// Standard net order for many solvers: U, R, F, D, L, B
const order: Face[] = ['U', 'R', 'F', 'D', 'L', 'B'];

// Kociemba solver expects colors in URFDLB order: White, Red, Green, Yellow, Orange, Blue
const colorMapping: Record<Color, string> = {
  'W': 'U', // White -> Up
  'R': 'R', // Red -> Right  
  'G': 'F', // Green -> Front
  'Y': 'D', // Yellow -> Down
  'O': 'L', // Orange -> Left
  'B': 'B'  // Blue -> Back
};

export const to54String = (state: CubeState): string => {
  // Convert our color format to Kociemba's expected format
  return order.map((f) => 
    state.faces[f]!.map(c => colorMapping[c]).join('')
  ).join('');
};

// Quick check: each color appears exactly 9 times
export const countColorsOk = (state: CubeState) => {
  const counts: Record<Color, number> = { W: 0, R: 0, B: 0, O: 0, G: 0, Y: 0 };
  Object.values(state.faces).forEach((face) => {
    face!.forEach((c) => (counts[c]++));
  });
  return Object.values(counts).every((n) => n === 9);
};


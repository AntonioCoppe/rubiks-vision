import { CubeState } from '../../types/cube';
import { countColorsOk } from './mapping';

export interface LegalityResult {
  isLegal: boolean;
  colorCounts: Record<string, number>;
  overCounted: string[];
  underCounted: string[];
}

export const isMaybeLegal = (s: CubeState): LegalityResult => {
  // MVP: color counts only; real legality adds permutation/orientation parity checks.
  const counts: Record<string, number> = { W: 0, R: 0, B: 0, O: 0, G: 0, Y: 0 };
  
  Object.values(s.faces).forEach((face) => {
    face!.forEach((c) => (counts[c]++));
  });
  
  const overCounted: string[] = [];
  const underCounted: string[] = [];
  
  Object.entries(counts).forEach(([color, count]) => {
    if (count > 9) {
      overCounted.push(`${color} (${count})`);
    } else if (count < 9) {
      underCounted.push(`${color} (${count})`);
    }
  });
  
  const isLegal = Object.values(counts).every((n) => n === 9);
  
  return {
    isLegal,
    colorCounts: counts,
    overCounted,
    underCounted
  };
};


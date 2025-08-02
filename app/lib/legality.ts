import { CubeState } from '../../types/cube';
import { countColorsOk } from './mapping';

export const isMaybeLegal = (s: CubeState) => {
  // MVP: color counts only; real legality adds permutation/orientation parity checks.
  return countColorsOk(s);
};

